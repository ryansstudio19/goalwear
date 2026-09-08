import subprocess
import math
import os
import random

def main():
    os.makedirs("public", exist_ok=True)
    out_path = "public/stadium-kickoff-hero.mp4"
    W, H = 1280, 720
    FPS = 30
    DURATION = 5.0
    TOTAL_FRAMES = int(FPS * DURATION)

    print(f"Generating {out_path} ({W}x{H} @ {FPS}fps, {TOTAL_FRAMES} frames)...")

    cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{W}x{H}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "fast",
        "-crf", "20",
        "-movflags", "+faststart",
        out_path
    ]

    p = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.PIPE)

    # Precompute random crowd seeds for consistency across frames
    random.seed(42)
    crowd_particles = []
    for _ in range(4500):
        cx = random.uniform(-0.3, 1.4)
        cy = random.uniform(0.12, 0.72)
        tier = 0 if cy < 0.32 else (1 if cy < 0.52 else 2)
        # Fan shirt colors: white, red, blue, yellow, black, green
        c_choice = random.choice([
            (210, 220, 230), (180, 40, 50), (40, 90, 190),
            (220, 180, 30), (40, 50, 60), (30, 140, 70), (140, 150, 160)
        ])
        crowd_particles.append({
            'x': cx,
            'y': cy,
            'tier': tier,
            'color': c_choice,
            'flash_freq': random.uniform(0.5, 4.0),
            'flash_offset': random.uniform(0, 10.0)
        })

    # Atmosphere dust particles
    dust = []
    for _ in range(250):
        dust.append({
            'x': random.uniform(0, 1),
            'y': random.uniform(0, 1),
            'speed_x': random.uniform(-0.02, 0.02),
            'speed_y': random.uniform(-0.04, -0.01),
            'size': random.randint(1, 3),
            'alpha': random.uniform(0.3, 0.9)
        })

    # Floodlight banks definitions
    floodlights = [
        {'x_ratio': 0.12, 'y_ratio': 0.14, 'rays_angle': 55, 'intensity': 1.0},
        {'x_ratio': 0.34, 'y_ratio': 0.11, 'rays_angle': 52, 'intensity': 0.95},
        {'x_ratio': 0.58, 'y_ratio': 0.07, 'rays_angle': 48, 'intensity': 0.85},
    ]

    for f_idx in range(TOTAL_FRAMES):
        t = f_idx / FPS
        norm_t = f_idx / TOTAL_FRAMES

        # Camera pan: subtle horizontal tracking and slight tilt
        pan_offset_x = math.sin(norm_t * math.pi * 0.8) * 70
        camera_pitch = math.sin(norm_t * math.pi * 0.6) * 12

        # Initialize frame buffer with deep midnight stadium sky
        buf = bytearray(W * H * 3)

        # 1. Sky gradient (top: deep space blue-black to horizon navy)
        for y in range(H):
            ratio = y / H
            # Sky darkening
            sr = int(6 + ratio * 8)
            sg = int(10 + ratio * 16)
            sb = int(22 + ratio * 28)
            row_start = y * W * 3
            # Fast fill of background
            row_bytes = bytes([sr, sg, sb]) * W
            buf[row_start : row_start + W * 3] = row_bytes

        # 2. Render Curved Grandstand Tiers
        # Upper Tier: y from ~0.12 to 0.32
        # Mid Tier: y from ~0.32 to 0.52
        # Lower Tier: y from ~0.52 to 0.72
        # Pitch: y from ~0.72 to 1.0

        # Draw Grandstand Concrete Backing
        for y in range(int(H * 0.12), int(H * 0.72)):
            norm_y = y / H
            # Curve perspective across X
            for x in range(W):
                curve = math.sin((x / W) * 2.8 - 0.4) * 35
                curved_y = y + curve + camera_pitch

                if 0 <= curved_y < H:
                    tier_idx = 0 if norm_y < 0.32 else (1 if norm_y < 0.52 else 2)
                    # Concrete tier shadow and shading
                    base_lum = int(22 + tier_idx * 10 - (curved_y % 18) * 0.8)
                    idx = (int(curved_y) * W + x) * 3
                    buf[idx] = min(255, buf[idx] + base_lum)
                    buf[idx+1] = min(255, buf[idx+1] + int(base_lum * 1.1))
                    buf[idx+2] = min(255, buf[idx+2] + int(base_lum * 1.3))

        # Draw Crowd Spectators (dense dot texture with team colors)
        for p_dot in crowd_particles:
            px = int((p_dot['x'] * W + pan_offset_x * (0.6 + p_dot['tier'] * 0.2)) % (W + 80) - 40)
            py_base = p_dot['y'] * H
            curve = math.sin((px / W) * 2.8 - 0.4) * 35
            py = int(py_base + curve + camera_pitch)

            if 0 <= px < W and 0 <= py < H:
                cr, cg, cb = p_dot['color']
                # Check for camera flash
                flash = math.sin(t * p_dot['flash_freq'] + p_dot['flash_offset'])
                if flash > 0.96:
                    cr, cg, cb = 255, 255, 255
                    # Flash bloom
                    for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)]:
                        fx, fy = px + dx, py + dy
                        if 0 <= fx < W and 0 <= fy < H:
                            f_idx2 = (fy * W + fx) * 3
                            buf[f_idx2] = min(255, buf[f_idx2] + 160)
                            buf[f_idx2+1] = min(255, buf[f_idx2+1] + 180)
                            buf[f_idx2+2] = min(255, buf[f_idx2+2] + 220)

                idx = (py * W + px) * 3
                buf[idx] = min(255, buf[idx] + cr)
                buf[idx+1] = min(255, buf[idx+1] + cg)
                buf[idx+2] = min(255, buf[idx+2] + cb)

        # Draw Fascia / LED Ribbon Boards between Tiers
        for fascia_y_norm in [0.32, 0.52, 0.70]:
            for x in range(W):
                curve = math.sin((x / W) * 2.8 - 0.4) * 35
                fy = int(fascia_y_norm * H + curve + camera_pitch)
                if 0 <= fy < H - 5:
                    for th in range(5):
                        idx = ((fy + th) * W + x) * 3
                        # Glowing LED ribbon board
                        led_wave = math.sin(x * 0.08 - t * 4) * 30
                        buf[idx] = min(255, buf[idx] + int(120 + led_wave * 0.5))
                        buf[idx+1] = min(255, buf[idx+1] + int(140 + led_wave * 0.6))
                        buf[idx+2] = min(255, buf[idx+2] + int(180 + led_wave * 0.8))

        # 3. Render Green Turf Lawn (Pitch level from y ~0.70 to 1.0)
        pitch_y_start = int(H * 0.70)
        for y in range(pitch_y_start, H):
            norm_pitch = (y - pitch_y_start) / (H - pitch_y_start)
            # Perspective grass striping
            stripe_width = 80 + int(norm_pitch * 140)
            stripe = (int(pan_offset_x * 1.5) + y * 2) // stripe_width % 2
            grass_base_r = 18 if stripe else 12
            grass_base_g = 135 if stripe else 105
            grass_base_b = 65 if stripe else 48

            # Lighting gradient: brighter near floodlight reflections, darker at bottom
            light_mult = 1.0 + (1.0 - norm_pitch) * 0.45
            gr = int(grass_base_r * light_mult)
            gg = int(grass_base_g * light_mult)
            gb = int(grass_base_b * light_mult)

            row_start = y * W * 3
            for x in range(W):
                # Pitch turf texture
                idx = row_start + x * 3
                buf[idx] = min(255, buf[idx] + gr)
                buf[idx+1] = min(255, buf[idx+1] + gg)
                buf[idx+2] = min(255, buf[idx+2] + gb)

        # 4. Volumetric Stadium Floodlight Beams (God rays cutting through night mist)
        for fl in floodlights:
            fl_x = int(fl['x_ratio'] * W + pan_offset_x * 0.3)
            fl_y = int(fl['y_ratio'] * H + camera_pitch * 0.5)

            # Draw light cone rays
            ray_angle_rad = math.radians(fl['rays_angle'])
            for ray_i in range(-18, 19):
                cur_ang = ray_angle_rad + math.radians(ray_i * 1.6)
                cos_a = math.cos(cur_ang)
                sin_a = math.sin(cur_ang)

                # Trace beam down to pitch
                for dist in range(20, int(H * 1.2), 4):
                    bx = int(fl_x + sin_a * dist)
                    by = int(fl_y + cos_a * dist)
                    if 0 <= bx < W and 0 <= by < H:
                        beam_intensity = max(0.0, 1.0 - (dist / (H * 1.1))) * fl['intensity'] * 0.35
                        ray_center_fade = max(0.0, 1.0 - abs(ray_i) / 18.0)
                        beam_add = int(80 * beam_intensity * ray_center_fade)

                        idx = (by * W + bx) * 3
                        buf[idx] = min(255, buf[idx] + int(beam_add * 0.95))
                        buf[idx+1] = min(255, buf[idx+1] + int(beam_add * 0.98))
                        buf[idx+2] = min(255, buf[idx+2] + int(beam_add * 1.15))

        # 5. Draw Floodlight Rig Bulbs & Lens Flares
        for fl in floodlights:
            fl_x = int(fl['x_ratio'] * W + pan_offset_x * 0.3)
            fl_y = int(fl['y_ratio'] * H + camera_pitch * 0.5)

            # 4x3 cluster of intense light bulbs
            for grid_row in range(3):
                for grid_col in range(4):
                    bx = fl_x + (grid_col - 2) * 11
                    by = fl_y + (grid_row - 1) * 9
                    if 0 <= bx < W and 0 <= by < H:
                        # Bulb core
                        for dx in range(-4, 5):
                            for dy in range(-4, 5):
                                dist2 = dx*dx + dy*dy
                                if dist2 <= 16:
                                    nx, ny = bx + dx, by + dy
                                    if 0 <= nx < W and 0 <= ny < H:
                                        b_idx = (ny * W + nx) * 3
                                        alpha = 1.0 - (dist2 / 16)
                                        buf[b_idx] = min(255, buf[b_idx] + int(240 * alpha))
                                        buf[b_idx+1] = min(255, buf[b_idx+1] + int(245 * alpha))
                                        buf[b_idx+2] = min(255, buf[b_idx+2] + int(255 * alpha))

            # Lens Flare Streaks (horizontal flare rays)
            for fx in range(-120, 121):
                px = fl_x + fx
                if 0 <= px < W and 0 <= fl_y < H:
                    flare_fade = max(0.0, 1.0 - abs(fx) / 120.0)
                    f_idx = (fl_y * W + px) * 3
                    f_val = int(140 * flare_fade)
                    buf[f_idx] = min(255, buf[f_idx] + int(f_val * 0.9))
                    buf[f_idx+1] = min(255, buf[f_idx+1] + int(f_val * 0.95))
                    buf[f_idx+2] = min(255, buf[f_idx+2] + f_val)

        # 6. Floating Atmosphere Dust & Motes in Stadium Light
        for d in dust:
            dx = int(((d['x'] + d['speed_x'] * t) % 1.0) * W)
            dy = int(((d['y'] + d['speed_y'] * t) % 1.0) * H)
            if 0 <= dx < W and 0 <= dy < H:
                d_idx = (dy * W + dx) * 3
                d_val = int(220 * d['alpha'])
                buf[d_idx] = min(255, buf[d_idx] + d_val)
                buf[d_idx+1] = min(255, buf[d_idx+1] + d_val)
                buf[d_idx+2] = min(255, buf[d_idx+2] + int(d_val * 1.1))

        p.stdin.write(buf)

    p.stdin.close()
    p.wait()
    print(f"Successfully generated {out_path}! Size: {os.path.getsize(out_path)} bytes")

    # Generate companion poster image
    subprocess.run([
        "ffmpeg", "-y",
        "-ss", "00:00:02.500",
        "-i", out_path,
        "-vframes", "1",
        "-q:v", "2",
        "public/stadium-kickoff-poster.jpg"
    ], check=True)
    print("Generated public/stadium-kickoff-poster.jpg!")

if __name__ == "__main__":
    main()
