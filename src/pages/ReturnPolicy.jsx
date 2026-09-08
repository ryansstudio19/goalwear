import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RotateCcw, 
  ShieldCheck, 
  Truck, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  HelpCircle, 
  ArrowRight,
  RefreshCw,
  FileText,
  PackageCheck,
  ChevronDown
} from 'lucide-react';

export default function ReturnPolicy() {
  const navigate = useNavigate();

  // Interactive Return Eligibility Checker State
  const [returnReason, setReturnReason] = useState('size');
  const [daysElapsed, setDaysElapsed] = useState('within7');
  const [tagsIntact, setTagsIntact] = useState('yes');
  const [customPrinted, setCustomPrinted] = useState('no');

  // FAQ accordion state
  const [activeFaq, setActiveFaq] = useState(null);

  // Compute eligibility verdict
  const getEligibilityVerdict = () => {
    if (daysElapsed === 'over7') {
      return {
        eligible: false,
        title: 'Exchange Window Expired',
        message: 'Returns and exchanges must be reported within 7 calendar days of courier delivery. Contact our support team on WhatsApp if there are special extenuating circumstances.',
        type: 'error'
      };
    }

    if (tagsIntact === 'no') {
      return {
        eligible: false,
        title: 'Tags Must Be Attached',
        message: 'Jerseys must have original manufacturer tags, hologram seals, and original polybags attached and be unworn to be eligible for exchange.',
        type: 'error'
      };
    }

    if (customPrinted === 'yes' && returnReason !== 'defect') {
      return {
        eligible: false,
        title: 'Personalized Custom Items',
        message: 'Jerseys personalized with custom personal names or numbers cannot be exchanged for change of mind or general sizing. If there is a printing defect or typo caused by GoalWear, it is 100% covered for a free replacement.',
        type: 'warning'
      };
    }

    if (returnReason === 'defect' || returnReason === 'wrong_item') {
      return {
        eligible: true,
        title: '100% Free Replacement or Full Refund',
        message: 'GoalWear covers 100% of all courier pickup and re-delivery charges for factory defects, damaged patches, or mismatched kits. We will immediately dispatch a replacement or issue a full refund.',
        type: 'success'
      };
    }

    return {
      eligible: true,
      title: 'Eligible for Direct Size Exchange',
      message: 'You are eligible for a quick size replacement. Our team will verify your unworn jersey and dispatch your desired size. Standard courier delivery fee applies for size preference swaps.',
      type: 'success'
    };
  };

  const verdict = getEligibilityVerdict();

  const policyFaqs = [
    {
      q: 'How many days do I have to request a return or size exchange?',
      a: 'You have exactly 7 calendar days from the date your courier (Pathao, Steadfast, or RedX) delivers the parcel to inspect your jersey and notify our support squad on WhatsApp or email.'
    },
    {
      q: 'Can I exchange my jersey for a different size (e.g., M to L)?',
      a: 'Yes! Size exchanges are our most common request. As long as the jersey is unworn, clean, and has original tags attached, we will happily swap it for your preferred size. Check our Size Guide calculator before initiating.'
    },
    {
      q: 'Can I inspect the jersey before paying the courier on Cash on Delivery (COD)?',
      a: 'Yes! We encourage all customers across Bangladesh to open the parcel and inspect the jersey fabric, player printing, and tags in front of the delivery rider before handing over the COD amount.'
    },
    {
      q: 'What if my jersey arrived with a defect, pull, or incorrect badge?',
      a: 'If a jersey has a manufacturing flaw or we dispatched the wrong kit variant, we offer a 100% free immediate replacement or full refund. GoalWear bears all courier shipping expenses.'
    },
    {
      q: 'Are personalized jerseys (custom name & number) returnable?',
      a: 'Jerseys customized with your personal name or custom squad numbers cannot be returned for change-of-mind or size mismatches, as they cannot be resold. However, if our printing department made a spelling mistake or the print peeled upon unboxing, we provide an immediate 100% free replacement.'
    },
    {
      q: 'How will I receive my refund and how long does it take?',
      a: 'Once the returned item is inspected at our Dhaka fulfillment warehouse (typically within 24 hours of receipt), your refund is instantly disbursed via bKash, Nagad, Bank Transfer, or GoalWear Store Credit (with an optional 10% bonus voucher).'
    },
    {
      q: 'Is the initial bKash delivery fee (120 Tk) refundable?',
      a: 'The 120 Tk courier fee is non-refundable if a package is dispatched and subsequently refused due to customer change of mind. However, if your order is canceled before dispatch or if you received a defective item, the delivery fee is 100% refunded.'
    }
  ];

  return (
    <div className="container-custom" style={{ paddingTop: '40px', paddingBottom: '90px' }}>
      
      {/* Header Breadcrumb & Badging */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '20px',
          backgroundColor: 'rgba(0, 255, 136, 0.08)',
          border: '1px solid rgba(0, 255, 136, 0.25)',
          color: 'var(--accent, #00ff88)',
          fontSize: '0.78rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '16px'
        }}>
          <ShieldCheck size={16} />
          <span>GoalWear Matchday Guarantee</span>
        </div>

        <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: '0 0 14px 0' }}>
          Return &amp; Refund <span>Policy</span>
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1rem',
          maxWidth: '680px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Every jersey dispatched by GoalWear is backed by our customer-first commitment. Clear, transparent guidelines for easy size exchanges, verified returns, and swift refunds across Bangladesh.
        </p>
      </div>

      {/* 4 Core Guarantee Highlights */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '50px'
      }}>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 255, 136, 0.12)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock size={22} color="var(--accent)" />
          </div>
          <h3 style={{ fontSize: '1.1rem', color: '#ffffff', margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>
            7-Day Exchange Window
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            Report any sizing or fit mismatch within 7 calendar days from courier delivery to claim an exchange.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 255, 136, 0.12)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Truck size={22} color="var(--accent)" />
          </div>
          <h3 style={{ fontSize: '1.1rem', color: '#ffffff', margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>
            Doorstep Inspection
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            You can verify parcel packaging and kit authenticity in front of your courier agent before full cash handover.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 255, 136, 0.12)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <RotateCcw size={22} color="var(--accent)" />
          </div>
          <h3 style={{ fontSize: '1.1rem', color: '#ffffff', margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>
            Rapid Refund Payouts
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            Approved refunds are sent directly to your bKash, Nagad, or Bank account within 24 to 48 hours of warehouse inspection.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 255, 136, 0.12)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={22} color="var(--accent)" />
          </div>
          <h3 style={{ fontSize: '1.1rem', color: '#ffffff', margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>
            Zero-Risk Guarantee
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            If we sent the wrong team kit or a factory defect occurs, GoalWear pays 100% of return shipping expenses.
          </p>
        </div>
      </div>

      {/* Main Grid: Comprehensive Policy Rules + Interactive Eligibility Checker */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '40px',
        marginBottom: '60px'
      }}>
        
        {/* Interactive Eligibility Checker Box */}
        <div className="glass-panel" style={{
          padding: 'clamp(20px, 4vw, 32px)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          background: 'linear-gradient(180deg, rgba(3, 7, 18, 0.9) 0%, rgba(10, 15, 26, 0.85) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <PackageCheck size={26} color="var(--accent)" />
            <h2 style={{ fontSize: '1.3rem', color: '#ffffff', margin: 0, fontWeight: 800, textTransform: 'uppercase' }}>
              Check Your Return &amp; Exchange Eligibility
            </h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Answer these 4 quick questions to instantly verify if your order qualifies for an exchange or refund:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {/* 1. Reason */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                1. Reason for Return
              </label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-glass)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'white',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              >
                <option value="size">Size does not fit (Too tight / loose)</option>
                <option value="defect">Damaged fabric or printing defect</option>
                <option value="wrong_item">Wrong kit or player dispatched</option>
                <option value="mind">Change of mind / styling</option>
              </select>
            </div>

            {/* 2. Days Elapsed */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                2. Days Since Delivery
              </label>
              <select
                value={daysElapsed}
                onChange={(e) => setDaysElapsed(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-glass)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'white',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              >
                <option value="within7">Within 7 days (Eligible)</option>
                <option value="over7">More than 7 days ago</option>
              </select>
            </div>

            {/* 3. Tags Intact */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                3. Tags &amp; Packaging
              </label>
              <select
                value={tagsIntact}
                onChange={(e) => setTagsIntact(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-glass)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'white',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              >
                <option value="yes">Unworn &amp; tags still attached</option>
                <option value="no">Worn / tags removed / washed</option>
              </select>
            </div>

            {/* 4. Custom Printed */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                4. Custom Personal Name?
              </label>
              <select
                value={customPrinted}
                onChange={(e) => setCustomPrinted(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-glass)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'white',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              >
                <option value="no">No, standard squad kit / plain</option>
                <option value="yes">Yes, custom name &amp; number</option>
              </select>
            </div>
          </div>

          {/* Dynamic Verdict Banner */}
          <div style={{
            padding: '18px 22px',
            borderRadius: '12px',
            backgroundColor: verdict.type === 'success' 
              ? 'rgba(0, 255, 136, 0.1)' 
              : verdict.type === 'warning' 
                ? 'rgba(255, 193, 7, 0.1)' 
                : 'rgba(255, 71, 87, 0.1)',
            border: `1px solid ${
              verdict.type === 'success' 
                ? 'var(--accent)' 
                : verdict.type === 'warning' 
                  ? '#ffc107' 
                  : '#ff4757'
            }`,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {verdict.type === 'success' ? (
                <CheckCircle2 size={20} color="var(--accent)" />
              ) : verdict.type === 'warning' ? (
                <AlertCircle size={20} color="#ffc107" />
              ) : (
                <XCircle size={20} color="#ff4757" />
              )}
              <h4 style={{
                margin: 0,
                fontSize: '1rem',
                fontWeight: 800,
                color: verdict.type === 'success' ? 'var(--accent)' : verdict.type === 'warning' ? '#ffc107' : '#ff4757'
              }}>
                {verdict.title}
              </h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#ffffff', lineHeight: 1.5 }}>
              {verdict.message}
            </p>
            
            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <a
                href={`https://wa.me/8801848520875?text=${encodeURIComponent(
                  `Hi GoalWear Support! I would like to request an exchange/return for my order.\nReason: ${returnReason}\nDelivery: ${daysElapsed}\nTags intact: ${tagsIntact}\nCustomized: ${customPrinted}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn-premium btn-primary-glow"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  borderRadius: '24px',
                  fontSize: '0.82rem',
                  fontWeight: 800
                }}
              >
                <MessageCircle size={15} />
                <span>Message on WhatsApp (+880 1848-520875)</span>
              </a>

              <button
                onClick={() => navigate('/size-guide')}
                className="btn-secondary-glass"
                style={{
                  padding: '8px 16px',
                  borderRadius: '24px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <span>Check Size Guide Calculator</span>
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Policy Breakdown & Terms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Section 1 */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 900 }}>01.</span>
              <span>Size Exchange Terms &amp; Procedures</span>
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
              Football kits vary between <strong>Fan Version (Regular Comfort Fit)</strong> and <strong>Player Issue (Athletic Slim Pro Cut)</strong>. If the jersey you ordered does not fit comfortably:
            </p>
            <ul style={{ paddingLeft: '20px', color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              <li>Notify our WhatsApp support team within <strong>7 days</strong> of delivery with your Order ID and photo of the unworn kit with tags.</li>
              <li>The customer is responsible for the courier return delivery charge (120 Tk for standard Dhaka/nationwide parcels) for size preference adjustments.</li>
              <li>Once our team inspects the returned shirt to confirm it is unworn and clean, the new replacement size is dispatched within <strong>24 hours</strong>.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 900 }}>02.</span>
              <span>Damaged, Defective, or Incorrect Items</span>
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
              We conduct a 3-point quality check on all crest embroideries, heat-applied badges, and fabric seams before packing. However, in the rare event of a defect or courier mishap:
            </p>
            <ul style={{ paddingLeft: '20px', color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              <li>Send unboxing photos or a video showing the flaw to <strong>goalwearbb@gmail.com</strong> or WhatsApp within 7 days.</li>
              <li>GoalWear assumes <strong>100% financial responsibility</strong>: we arrange pickup and deliver your flawless replacement jersey with zero additional delivery cost.</li>
              <li>If the item is out of stock in your size, you can choose any alternate kit or request an immediate 100% refund.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 900 }}>03.</span>
              <span>Custom Nameset &amp; Player Number Printing</span>
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
              Customized kits featuring custom personal names and numbers are uniquely personalized for you. Therefore:
            </p>
            <ul style={{ paddingLeft: '20px', color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              <li>Customized jerseys are non-returnable for change of mind or personal size choice. Please consult our <button onClick={() => navigate('/size-guide')} style={{ color: 'var(--accent)', textDecoration: 'underline', fontWeight: 600 }}>Size Guide</button> carefully before ordering.</li>
              <li>If GoalWear printed an incorrect spelling, incorrect number, or if the heat-press transfer arrived damaged, we will replace the customized jersey at zero cost.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 900 }}>04.</span>
              <span>Refund Timelines &amp; Payment Methods</span>
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
              When a refund is approved by our management team:
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginTop: '10px'
            }}>
              <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '0.95rem' }}>bKash / Nagad</span>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '6px 0 0 0' }}>
                  Disbursed directly to your personal wallet within 24–48 hours.
                </p>
              </div>
              <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '0.95rem' }}>Bank Transfer (NPSB/BEFTN)</span>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '6px 0 0 0' }}>
                  Credited to your domestic bank account in 2 to 3 business days.
                </p>
              </div>
              <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '0.95rem' }}>Store Credit (+10% Bonus)</span>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '6px 0 0 0' }}>
                  Instant digital voucher code with an extra 10% bonus for your next kit.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4-Step Walkthrough */}
      <div style={{ marginBottom: '60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', textTransform: 'uppercase', margin: 0, fontWeight: 800 }}>
            How to Initiate an Exchange or Return in 4 Steps
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
            Fast, straightforward, and managed by real football lovers.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          {[
            {
              step: 'Step 1',
              title: 'Check Condition',
              desc: 'Confirm jersey is unworn, clean, unwashed, and original hangtags are intact.'
            },
            {
              step: 'Step 2',
              title: 'Reach Out on WhatsApp',
              desc: 'Message +880 1848-520875 with your Order ID and 2 clear photos of the issue.'
            },
            {
              step: 'Step 3',
              title: 'Hand Over to Courier',
              desc: 'Our rider or partner courier picks up the parcel or you drop off at nearest counter.'
            },
            {
              step: 'Step 4',
              title: 'Get Replacement / Refund',
              desc: 'New size dispatched within 24 hours or refund deposited to your bKash wallet.'
            }
          ].map((item, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 900,
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                {item.step}
              </span>
              <h3 style={{ fontSize: '1.05rem', color: '#ffffff', margin: '8px 0 10px 0', fontWeight: 700 }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Policy Questions */}
      <div style={{ marginBottom: '60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', textTransform: 'uppercase', margin: 0, fontWeight: 800 }}>
            Policy Questions &amp; Answers
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
            Quick answers to the most common return and exchange situations.
          </p>
        </div>

        <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {policyFaqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="glass-panel" 
                style={{ 
                  borderRadius: '10px', 
                  overflow: 'hidden',
                  border: isOpen ? '1px solid var(--accent)' : '1px solid var(--border-glass)',
                  transition: 'all 0.2s ease'
                }}
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer'
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={18} 
                    style={{ 
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      color: isOpen ? 'var(--accent)' : 'var(--text-muted)'
                    }} 
                  />
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 24px 20px 24px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: '16px'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Support Direct Contact Help Card */}
      <div className="glass-panel" style={{
        padding: 'clamp(24px, 5vw, 40px)',
        textAlign: 'center',
        border: '1px solid rgba(0, 255, 136, 0.3)',
        background: 'radial-gradient(ellipse at center, rgba(0, 255, 136, 0.08) 0%, rgba(3, 7, 18, 0.95) 100%)'
      }}>
        <h2 style={{ fontSize: '1.6rem', color: '#ffffff', textTransform: 'uppercase', margin: '0 0 10px 0', fontWeight: 900 }}>
          Need Help With an Active Order?
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '560px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
          Our customer happiness squad is active daily. Message us with your order number and we will resolve any issue promptly.
        </p>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px'
        }}>
          <a
            href="https://wa.me/8801848520875"
            target="_blank"
            rel="noreferrer"
            className="btn-premium btn-primary-glow"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '30px',
              fontSize: '0.85rem',
              fontWeight: 800
            }}
          >
            <MessageCircle size={17} />
            <span>WhatsApp Support: +880 1848-520875</span>
          </a>

          <a
            href="mailto:goalwearbb@gmail.com"
            className="btn-secondary-glass"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '30px',
              fontSize: '0.85rem',
              fontWeight: 700
            }}
          >
            <Mail size={17} />
            <span>Email: goalwearbb@gmail.com</span>
          </a>

          <button
            onClick={() => navigate('/track-order')}
            className="btn-secondary-glass"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '30px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Truck size={17} />
            <span>Track Order Status</span>
          </button>
        </div>
      </div>

    </div>
  );
}
