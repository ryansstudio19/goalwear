import React, { useContext, useMemo } from 'react';
import { ArrowDownRight, ArrowUpRight, ChevronRight, CircleDot, Move3d, ShieldCheck, Sparkles, Truck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { products as fallbackProducts } from '../data/products';
import JerseyViewer3D from '../components/JerseyViewer3D';

const marqueeItems = ['MATCHDAY ENERGY', 'PLAYER-ISSUE DETAIL', 'BUILT FOR THE 90'];

export default function Home() {
  const navigate = useNavigate();
  const { products: catalogProducts } = useContext(ShopContext);
  const allProducts = useMemo(() => (catalogProducts?.length ? catalogProducts : fallbackProducts), [catalogProducts]);
  const featured = allProducts[0];
  const dropProducts = allProducts.slice(0, 4);

  const go = (path) => navigate(path);

  return (
    <div className="home-page">
      <section className="tunnel-hero" aria-labelledby="hero-title">
        <div className="tunnel-hero__ambient" aria-hidden="true">
          <span className="hero-light hero-light--left" />
          <span className="hero-light hero-light--right" />
          <span className="hero-light hero-light--top" />
          <div className="tunnel-ribs" />
          <div className="tunnel-floor-grid" />
        </div>
        <div className="container-custom tunnel-hero__inner">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> Drop 01 / 26 <span className="eyebrow-line" /> Now entering</div>
            <h1 id="hero-title">Wear the<br /><em>moment.</em></h1>
            <p className="hero-lede">Matchday kits for the people who never leave the tunnel. Premium football jerseys, player-issue details, and the energy of the 90.</p>
            <div className="hero-actions">
              <button className="btn-primary btn-primary--large" onClick={() => go('/shop')}>Enter the drop <ArrowUpRight size={18} /></button>
              <button className="text-link" onClick={() => go(`/product/${featured?.id}`)}>View featured kit <ChevronRight size={16} /></button>
            </div>
            <div className="hero-stats" aria-label="GoalWear facts">
              <div><strong>24/25</strong><span>season edit</span></div>
              <div><strong>07</strong><span>teams in rotation</span></div>
              <div><strong>24h</strong><span>Dhaka dispatch</span></div>
            </div>
          </div>

          <div className="hero-stage" aria-label="Interactive 3D jersey viewer">
            <div className="stage-topline"><span>Interactive jersey lab</span><span><CircleDot size={11} /> Live preview</span></div>
            <div className="stage-card">
              <div className="stage-corner stage-corner--tl">GW / 001</div>
              <div className="stage-corner stage-corner--tr">Drag to rotate</div>
              <div className="stage-corner stage-corner--bl">{featured?.category || 'National Teams'}</div>
              <div className="stage-corner stage-corner--br">01 — 04</div>
              <div className="viewer-backdrop" />
              <JerseyViewer3D design={featured?.design || { primaryColor: '#75bde8', secondaryColor: '#ffffff', stripeType: 'vertical', stripeColor: '#ffffff', sponsorText: 'A F A', numberText: '10', collarColor: '#ffffff', badgeColor: '#d7bd61' }} />
              <div className="stage-hint"><Move3d size={15} /> <span>Rotate / zoom the jersey</span></div>
            </div>
            <div className="stage-caption"><div><span className="caption-kicker">Featured drop</span><strong>{featured?.name || 'Argentina 2026 Home Jersey'}</strong></div><button onClick={() => go(`/product/${featured?.id}`)} aria-label="Open featured jersey"><ArrowUpRight size={20} /></button></div>
          </div>
        </div>
        <div className="hero-scroll"><span>Scroll to explore</span><ArrowDownRight size={17} /></div>
      </section>

      <div className="marquee" aria-hidden="true"><div className="marquee-track">{[...marqueeItems, ...marqueeItems].map((item, index) => <span key={`${item}-${index}`}>{item}<b>✳</b></span>)}</div></div>

      <section className="section section--intro container-custom">
        <div className="section-number">01 / The edit</div>
        <div className="intro-grid">
          <h2>Not a jersey store.<br /><span>A matchday state of mind.</span></h2>
          <div className="intro-copy"><p>GoalWear is a curated locker room for football culture. We pick the kits that belong in the stands, on the street, and in the memories you keep after the final whistle.</p><button className="text-link" onClick={() => go('/about')}>Read our story <ChevronRight size={16} /></button></div>
        </div>
        <div className="signal-grid"><div className="signal-card signal-card--wide"><div className="signal-card__visual signal-card__visual--tunnel"><span>01</span><strong>Walk in<br />like you<br />mean it.</strong></div><div className="signal-card__meta"><span>Atmosphere</span><b>01 / 03</b></div></div><div className="signal-card"><div className="signal-card__visual signal-card__visual--fabric"><span>02</span><strong>Details<br />worth<br />touching.</strong></div><div className="signal-card__meta"><span>Construction</span><b>02 / 03</b></div></div><div className="signal-card"><div className="signal-card__visual signal-card__visual--stands"><span>03</span><strong>Made for<br />the loud<br />ones.</strong></div><div className="signal-card__meta"><span>Culture</span><b>03 / 03</b></div></div></div>
      </section>

      <section className="section section--drop container-custom" id="latest-drop">
        <div className="section-heading"><div><div className="section-number">02 / The latest drop</div><h2>Pick your<br /><span>colours.</span></h2></div><button className="text-link" onClick={() => go('/shop')}>Shop all kits <ArrowUpRight size={17} /></button></div>
        <div className="drop-grid">{dropProducts.map((product, index) => <button className="drop-card" key={product.id} onClick={() => go(`/product/${product.id}`)}><div className="drop-card__image"><img src={product.image} alt={product.name} loading={index > 1 ? 'lazy' : 'eager'} /><span className="drop-card__index">0{index + 1}</span><span className="drop-card__arrow"><ArrowUpRight size={19} /></span></div><div className="drop-card__body"><div><span>{product.category}</span><strong>{product.name}</strong></div><b>{product.price} BDT</b></div></button>)}</div>
      </section>

      <section className="manifesto"><div className="container-custom manifesto__inner"><div className="section-number">03 / Why GoalWear</div><h2>For the shirt.<br />For the story.<br /><span>For the 90.</span></h2><div className="manifesto__aside"><p>Every piece gets the same treatment: breathable match-grade fabric, precise badge work, and a fit that feels right whether you are on the pitch or behind the goal.</p><div className="manifesto__points"><div><ShieldCheck size={18} /><span>Verified quality</span></div><div><Zap size={18} /><span>Fast dispatch</span></div><div><Truck size={18} /><span>Nationwide COD</span></div></div></div></div></section>

      <section className="section section--closing container-custom"><div className="closing-card"><div><div className="eyebrow"><Sparkles size={14} /> GoalWear / Matchday club</div><h2>Find the kit<br /><em>that feels like yours.</em></h2></div><button className="btn-primary btn-primary--large" onClick={() => go('/shop')}>Enter GoalWear <ArrowUpRight size={18} /></button></div></section>
    </div>
  );
}
