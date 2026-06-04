import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Star } from 'lucide-react';

export default function ReviewsSection({ product }) {
  const { customReviews, addReview } = useContext(ShopContext);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState(false);

  // Combine static reviews with custom user reviews
  const defaultReviews = product.reviews || [];
  const userAddedReviews = customReviews[product.id] || [];
  const allReviews = [...userAddedReviews, ...defaultReviews];

  // Calculate average rating
  const averageRating = allReviews.length > 0 
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
    : product.rating;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      alert("Please fill out all fields.");
      return;
    }

    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const newReview = {
      id: Date.now(),
      user: name,
      rating: Number(rating),
      comment: comment,
      date: dateStr
    };

    addReview(product.id, newReview);
    setName('');
    setRating(5);
    setComment('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Average rating card */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '24px', 
          display: 'flex', 
          flexWrap: 'wrap',
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '3.2rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>
            {averageRating}
          </div>
          <div>
            <div style={{ display: 'flex', gap: '2px', color: '#ffb400', marginBottom: '4px' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  size={18} 
                  fill={s <= Math.round(averageRating) ? '#ffb400' : 'none'} 
                  color="#ffb400"
                />
              ))}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Based on {allReviews.length} customer reviews
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '400px' }}>
          Our jerseys are tested for high-performance pitch usage and color washing durability. 98% of verified buyers recommend this fit.
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        lgTemplateColumns: '1.2fr 1fr',
        gap: '40px'
      }} className="reviews-layout-grid">
        {/* Reviews List */}
        <div>
          <h3 style={{ fontSize: '1.2rem', textTransform: 'uppercase', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px' }}>
            Verified Buyer Reviews ({allReviews.length})
          </h3>
          {allReviews.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>No reviews yet. Be the first to share your feedback!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {allReviews.map((rev) => (
                <div 
                  key={rev.id} 
                  style={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)', 
                    paddingBottom: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>{rev.user}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                  </div>
                  
                  {/* Review Stars */}
                  <div style={{ display: 'flex', gap: '2px', color: '#ffb400' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        size={12} 
                        fill={s <= rev.rating ? '#ffb400' : 'none'} 
                        color="#ffb400"
                      />
                    ))}
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Form */}
        <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.2rem', textTransform: 'uppercase', marginBottom: '20px' }}>
            Write a Review
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Name Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Shakib Al Hasan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-glass)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'white',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Rating Stars Select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Rating</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{ color: '#ffb400', cursor: 'pointer' }}
                  >
                    <Star 
                      size={24} 
                      fill={s <= (hoverRating || rating) ? '#ffb400' : 'none'} 
                      color="#ffb400"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Review Comment</label>
              <textarea
                rows={4}
                required
                placeholder="Share your experience about fabric quality, colors, and sizing fit..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-glass)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'white',
                  fontSize: '0.9rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            {success && (
              <p style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600 }}>
                Review submitted successfully! Thank you for your feedback.
              </p>
            )}

            <button type="submit" className="btn-premium btn-primary-glow" style={{ width: '100%', padding: '12px 0' }}>
              Submit Review
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .reviews-layout-grid {
            grid-template-columns: 1.2fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
