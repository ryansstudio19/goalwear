import subprocess
import math
import sys
import os

def main():
    os.makedirs("public", exist_ok=True)
    out_path = "public/neon-stadium-intro.mp4"
    W, H = 1280, 720
    FPS = 30
    DURATION = 4.5
    TOTAL_FRAMES = int(FPS * DURATION)

    # We will generate frames using SVG piped into ffmpeg via ppm or raw rgb, or draw using Python
    # Since ffmpeg supports lavfi and filter_complex, we can create a high-quality video or pipe ppm
    print(f"Generating {out_path} ({W}x{H} @ {FPS}fps, {TOTAL_FRAMES} frames)...")

    # ffmpeg rawvideo pipe
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

    # Precalculate isometric transform
    # Isometric angles: 30 degrees tilt, 45 degrees yaw
    cos30 = math.cos(math.radians(28))
    sin30 = math.sin(math.radians(28))

    def iso_project(x, y, z, cx, cy, scale):
        # x is along length of pitch, y is across width, z is vertical
        iso_x = cx + (x - y) * cos30 * scale
        iso_y = cy + (x + y) * sin30 * scale - z * scale * 1.3
        return int(iso_x), int(iso_y)

    def draw_line(buf, x0, y0, x1, y1, r, g, b, thickness=1):
        dx = abs(x1 - x0)
        dy = abs(y1 - y0)
        sx = 1 if x0 < x1 else -1
        sy = 1 if y0 < y1 else -1
        err = dx - dy
        x, y = x0, y0
        rad = thickness // 2
        while True:
            for ty in range(-rad, rad + 1):
                for tx in range(-rad, rad + 1):
                    px, py = x + tx, y + ty
                    if 0 <= px < W and 0 <= py < H:
                        idx = (py * W + px) * 3
                        # Additive blending for neon glow
                        buf[idx] = min(255, buf[idx] + r)
                        buf[idx+1] = min(255, buf[idx+1] + g)
                        buf[idx+2] = min(255, buf[idx+2] + b)
            if x == x1 and y == y1:
                break
            e2 = 2 * err
            if e2 > -dy:
                err -= dy
                x += sx
            if e2 < dx:
                err += dx
                y += sy

    def draw_ellipse(buf, cx, cy, rx, ry, r, g, b, thickness=1, steps=80):
        prev_x, prev_y = None, None
        for i in range(steps + 1):
            theta = (i / steps) * 2 * math.pi
            px = int(cx + rx * math.cos(theta) * cos30 - ry * math.sin(theta) * cos30)
            py = int(cy + (rx * math.cos(theta) + ry * math.sin(theta)) * sin30)
            if prev_x is not None:
                draw_line(buf, prev_x, prev_y, px, py, r, g, b, thickness)
            prev_x, prev_y = px, py

    for f_idx in range(TOTAL_FRAMES):
        t = f_idx / FPS
        norm_t = f_idx / TOTAL_FRAMES

        # Background base: deep space black-blue
        buf = bytearray([3, 5, 12] * (W * H))

        # Camera pull-back: scale goes from 2.2 down to 1.45
        scale = 2.4 - 0.9 * (1.0 - math.exp(-2.5 * norm_t))
        cx = W // 2
        cy = int(H * 0.52 - 30 * norm_t)

        # Field dimensions (meters)
        L = 105
        B = 68

        # Progressive illumination
        field_progress = min(1.0, norm_t * 2.8) # 0 to ~0.35
        stands_progress = max(0.0, min(1.0, (norm_t - 0.25) * 2.2)) # ~0.25 to ~0.7
        roof_progress = max(0.0, min(1.0, (norm_t - 0.55) * 2.5)) # ~0.55 to 1.0

        # Neon Cyan color (primary)
        cyan_r, cyan_g, cyan_b = int(0 * field_progress), int(229 * field_progress), int(255 * field_progress)
        soft_cyan_r, soft_cyan_g, soft_cyan_b = int(0 * field_progress), int(140 * field_progress), int(200 * field_progress)

        # Ground Cyber Grid
        if field_progress > 0.1:
            grid_r = int(5 * field_progress)
            grid_g = int(25 * field_progress)
            grid_b = int(45 * field_progress)
            for gx in range(-160, 161, 40):
                p0 = iso_project(gx, -120, 0, cx, cy, scale)
                p1 = iso_project(gx, 120, 0, cx, cy, scale)
                draw_line(buf, p0[0], p0[1], p1[0], p1[1], grid_r, grid_g, grid_b, 1)
            for gy in range(-120, 121, 40):
                p0 = iso_project(-160, gy, 0, cx, cy, scale)
                p1 = iso_project(160, gy, 0, cx, cy, scale)
                draw_line(buf, p0[0], p0[1], p1[0], p1[1], grid_r, grid_g, grid_b, 1)

        # Pitch Boundary
        if field_progress > 0.05:
            pA = iso_project(-L/2, -B/2, 0, cx, cy, scale)
            pB = iso_project(L/2, -B/2, 0, cx, cy, scale)
            pC = iso_project(L/2, B/2, 0, cx, cy, scale)
            pD = iso_project(-L/2, B/2, 0, cx, cy, scale)
            draw_line(buf, pA[0], pA[1], pB[0], pB[1], cyan_r, cyan_g, cyan_b, 2)
            draw_line(buf, pB[0], pB[1], pC[0], pC[1], cyan_r, cyan_g, cyan_b, 2)
            draw_line(buf, pC[0], pC[1], pD[0], pD[1], cyan_r, cyan_g, cyan_b, 2)
            draw_line(buf, pD[0], pD[1], pA[0], pA[1], cyan_r, cyan_g, cyan_b, 2)

            # Halfway line
            pH0 = iso_project(0, -B/2, 0, cx, cy, scale)
            pH1 = iso_project(0, B/2, 0, cx, cy, scale)
            draw_line(buf, pH0[0], pH0[1], pH1[0], pH1[1], cyan_r, cyan_g, cyan_b, 2)

            # Center circle
            steps = 48
            cr = 9.15
            prev_p = None
            for i in range(steps + 1):
                ang = (i / steps) * 2 * math.pi
                px, py = cr * math.cos(ang), cr * math.sin(ang)
                pt = iso_project(px, py, 0, cx, cy, scale)
                if prev_p:
                    draw_line(buf, prev_p[0], prev_p[1], pt[0], pt[1], cyan_r, cyan_g, cyan_b, 2)
                prev_p = pt

            # Penalty boxes (Left)
            box_L = 16.5
            box_B = 40.32
            pL1 = iso_project(-L/2, -box_B/2, 0, cx, cy, scale)
            pL2 = iso_project(-L/2 + box_L, -box_B/2, 0, cx, cy, scale)
            pL3 = iso_project(-L/2 + box_L, box_B/2, 0, cx, cy, scale)
            pL4 = iso_project(-L/2, box_B/2, 0, cx, cy, scale)
            draw_line(buf, pL1[0], pL1[1], pL2[0], pL2[1], soft_cyan_r, soft_cyan_g, soft_cyan_b, 1)
            draw_line(buf, pL2[0], pL2[1], pL3[0], pL3[1], soft_cyan_r, soft_cyan_g, soft_cyan_b, 1)
            draw_line(buf, pL3[0], pL3[1], pL4[0], pL4[1], soft_cyan_r, soft_cyan_g, soft_cyan_b, 1)

            # Penalty boxes (Right)
            pR1 = iso_project(L/2, -box_B/2, 0, cx, cy, scale)
            pR2 = iso_project(L/2 - box_L, -box_B/2, 0, cx, cy, scale)
            pR3 = iso_project(L/2 - box_L, box_B/2, 0, cx, cy, scale)
            pR4 = iso_project(L/2, box_B/2, 0, cx, cy, scale)
            draw_line(buf, pR1[0], pR1[1], pR2[0], pR2[1], soft_cyan_r, soft_cyan_g, soft_cyan_b, 1)
            draw_line(buf, pR2[0], pR2[1], pR3[0], pR3[1], soft_cyan_r, soft_cyan_g, soft_cyan_b, 1)
            draw_line(buf, pR3[0], pR3[1], pR4[0], pR4[1], soft_cyan_r, soft_cyan_g, soft_cyan_b, 1)

            # Center Radar Pulse
            pulse_rad = ((t * 2.0) % 1.0) * 45
            pulse_alpha = max(0.0, 1.0 - (pulse_rad / 45))
            pulse_r = int(0 * pulse_alpha * field_progress)
            pulse_g = int(240 * pulse_alpha * field_progress)
            pulse_b = int(255 * pulse_alpha * field_progress)
            prev_pt = None
            for i in range(36 + 1):
                ang = (i / 36) * 2 * math.pi
                px = pulse_rad * math.cos(ang)
                py = pulse_rad * math.sin(ang)
                pt = iso_project(px, py, 0, cx, cy, scale)
                if prev_pt:
                    draw_line(buf, prev_pt[0], prev_pt[1], pt[0], pt[1], pulse_r, pulse_g, pulse_b, 1)
                prev_pt = pt

        # Stadium Seating Bowl Tiers
        if stands_progress > 0.05:
            st_r = int(0 * stands_progress)
            st_g = int(200 * stands_progress)
            st_b = int(255 * stands_progress)

            # 4 Elliptical Tiers at increasing height z
            tiers = [
                (70, 52, 4, 1),   # Lower pitchside ring
                (85, 64, 10, 1),  # Lower tier rim
                (102, 78, 18, 2), # Club tier
                (120, 92, 28, 2)  # Upper grandstand
            ]
            for rx, ry, rz, th in tiers:
                prev_p = None
                steps = 64
                for i in range(steps + 1):
                    theta = (i / steps) * 2 * math.pi
                    x = rx * math.cos(theta)
                    y = ry * math.sin(theta)
                    pt = iso_project(x, y, rz, cx, cy, scale)
                    if prev_p:
                        draw_line(buf, prev_p[0], prev_p[1], pt[0], pt[1], st_r, st_g, st_b, th)
                    prev_p = pt

            # Stadium structural ribs (spokes connecting tiers)
            for i in range(16):
                theta = (i / 16) * 2 * math.pi
                x0 = 70 * math.cos(theta)
                y0 = 52 * math.sin(theta)
                x1 = 120 * math.cos(theta)
                y1 = 92 * math.sin(theta)
                p0 = iso_project(x0, y0, 4, cx, cy, scale)
                p1 = iso_project(x1, y1, 28, cx, cy, scale)
                draw_line(buf, p0[0], p0[1], p1[0], p1[1], int(st_r * 0.4), int(st_g * 0.4), int(st_b * 0.4), 1)

        # Stadium Canopy Roof Rim & Floodlight Towers
        if roof_progress > 0.05:
            rf_r = int(0 * roof_progress)
            rf_g = int(245 * roof_progress)
            rf_b = int(255 * roof_progress)

            # Massive floating oval canopy rim
            rx_roof = 138
            ry_roof = 106
            rz_roof = 38
            prev_p = None
            steps = 72
            for i in range(steps + 1):
                theta = (i / steps) * 2 * math.pi
                x = rx_roof * math.cos(theta)
                y = ry_roof * math.sin(theta)
                pt = iso_project(x, y, rz_roof, cx, cy, scale)
                if prev_p:
                    draw_line(buf, prev_p[0], prev_p[1], pt[0], pt[1], rf_r, rf_g, rf_b, 3)
                prev_p = pt

            # Light pulse travelling around roof rim
            light_head = (t * 0.8) % (2 * math.pi)
            for j in range(12):
                lh = light_head - (j * 0.04)
                lx = rx_roof * math.cos(lh)
                ly = ry_roof * math.sin(lh)
                lp = iso_project(lx, ly, rz_roof, cx, cy, scale)
                glow_int = int(255 * (1.0 - j / 12) * roof_progress)
                draw_line(buf, lp[0]-1, lp[1], lp[0]+1, lp[1], glow_int, glow_int, 255, 2)

            # 4 Corner Floodlight Towers with Sky Beams
            towers = [(-115, -85), (115, -85), (115, 85), (-115, 85)]
            for tx, ty in towers:
                base = iso_project(tx, ty, 0, cx, cy, scale)
                top = iso_project(tx, ty, 42, cx, cy, scale)
                draw_line(buf, base[0], base[1], top[0], top[1], int(rf_r * 0.7), int(rf_g * 0.7), int(rf_b * 0.7), 2)
                # Vertical searchlight beam shooting into night sky
                sky_beam = iso_project(tx, ty, 140, cx, cy, scale)
                draw_line(buf, top[0], top[1], sky_beam[0], sky_beam[1], int(rf_r * 0.3), int(rf_g * 0.3), int(rf_b * 0.5), 1)

        p.stdin.write(buf)

    p.stdin.close()
    p.wait()
    print(f"Successfully generated {out_path}! Size: {os.path.getsize(out_path)} bytes")

if __name__ == "__main__":
    main()
