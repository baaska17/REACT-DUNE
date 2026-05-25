'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

export default function CommentSection({
  type,
  targetId,
  initialComments = [],
}) {
  const [comments, setComments] =
    useState(initialComments);

  const [formData, setFormData] =
    useState({
      userName: '',
      content: '',
      rating: 5,
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  /*
  ========================================
  FETCH COMMENTS
  ========================================
  */

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(
          `/api/comments?type=${type}&targetId=${targetId}`
        );

        if (res.ok) {
          const data =
            await res.json();

          setComments(data);
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (type && targetId) {
      fetchComments();
    }
  }, [type, targetId]);

  /*
  ========================================
  SUBMIT COMMENT
  useCallback — функцийн reference тогтворжуулна
  Lecture: "useCallback: stable ref for memo'd children"
  ========================================
  */

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    setLoading(true);

    setError('');

    try {
      const res = await fetch(
        '/api/comments',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            ...formData,

            type,

            targetId,
          }),
        }
      );

      const data =
        await res.json();

      if (res.ok) {
        setComments(prev => [data, ...prev]);

        setFormData({
          userName: '',
          content: '',
          rating: 5,
        });
      } else {
        setError(
          data.error ||
            'Failed to submit'
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        'Server connection failed'
      );
    } finally {
      setLoading(false);
    }
  }, [formData, type, targetId]);

  /*
  ========================================
  AVERAGE RATING
  useMemo — reduce() дахин тооцохоос зайлсхийнэ
  Lecture: "useMemo: cache expensive computation"
  ========================================
  */

  const averageRating = useMemo(
    () =>
      comments.length > 0
        ? (
            comments.reduce((acc, c) => acc + c.rating, 0) /
            comments.length
          ).toFixed(1)
        : '5.0',
    [comments]
  );

  /*
  ========================================
  RENDER
  ========================================
  */

  return (
    <section
      className="review-section"
      style={{
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      {/* HEADER */}

      <div
        className="review-header"
        style={{
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <h3
          style={{
            fontSize: '1.5rem',
            margin: 0,
            color:
              'var(--text-primary)',
          }}
        >
          Guest Reviews (
          {comments.length})
        </h3>

        <div
          style={{
            color:
              'var(--primary)',
            fontWeight: '700',
            fontSize: '1rem',
          }}
        >
          ⭐ {averageRating}
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div
          style={{
            background:
              'rgba(255,0,0,0.08)',

            border:
              '1px solid rgba(255,0,0,0.2)',

            color: '#ff6b6b',

            padding: '12px',

            borderRadius: '10px',

            marginBottom: '20px',

            fontSize: '0.9rem',
          }}
        >
          {error}
        </div>
      )}

      {/* FORM */}

      <div
        className="review-form-container"
        style={{
          background:
            'var(--bg-card)',

          border:
            '1px solid var(--border-color)',

          borderRadius: '20px',

          padding: '2rem',

          marginBottom: '2rem',
        }}
      >
        <h4
          style={{
            marginBottom: '1.2rem',
            fontSize: '1.2rem',
            color:
              'var(--text-primary)',
          }}
        >
          Share your experience
        </h4>

        <form
          onSubmit={handleSubmit}
        >
          {/* NAME */}

          <div
            style={{
              marginBottom: '1rem',
            }}
          >
            <input
              type="text"
              required
              placeholder="Your Name"
              value={
                formData.userName
              }
              onChange={(e) =>
                setFormData({
                  ...formData,

                  userName:
                    e.target.value,
                })
              }
              style={{
                width: '100%',

                padding:
                  '14px 16px',

                borderRadius:
                  '12px',

                border:
                  '1px solid var(--border-color)',

                background:
                  'var(--bg-secondary)',

                color:
                  'var(--text-primary)',

                fontSize:
                  '0.95rem',

                outline: 'none',
              }}
            />
          </div>

          {/* CONTENT */}

          <div
            style={{
              marginBottom: '1rem',
            }}
          >
            <textarea
              required
              placeholder="What did you like about your experience?"
              value={
                formData.content
              }
              onChange={(e) =>
                setFormData({
                  ...formData,

                  content:
                    e.target.value,
                })
              }
              style={{
                width: '100%',

                minHeight:
                  '110px',

                resize: 'vertical',

                padding:
                  '14px 16px',

                borderRadius:
                  '12px',

                border:
                  '1px solid var(--border-color)',

                background:
                  'var(--bg-secondary)',

                color:
                  'var(--text-primary)',

                fontSize:
                  '0.95rem',

                outline: 'none',
              }}
            />
          </div>

          {/* RATING */}

          <div
            style={{
              display: 'flex',

              alignItems:
                'center',

              gap: '10px',

              marginBottom: '1.5rem',
            }}
          >
            <span
              style={{
                color:
                  'var(--text-secondary)',

                fontSize:
                  '0.9rem',
              }}
            >
              Rating:
            </span>

            <div
              style={{
                display: 'flex',
                gap: '4px',
              }}
            >
              {[1, 2, 3, 4, 5].map(
                (num) => (
                  <span
                    key={num}
                    onClick={() =>
                      setFormData({
                        ...formData,

                        rating: num,
                      })
                    }
                    style={{
                      cursor:
                        'pointer',

                      fontSize:
                        '1.4rem',

                      color:
                        formData.rating >=
                        num
                          ? 'var(--primary)'
                          : '#666',
                    }}
                  >
                    ★
                  </span>
                )
              )}
            </div>
          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold"
            style={{
              width: '100%',

              justifyContent:
                'center',

              padding:
                '14px 20px',

              borderRadius:
                '14px',

              fontSize:
                '0.95rem',
            }}
          >
            {loading
              ? 'Submitting...'
              : 'Submit Review'}
          </button>
        </form>
      </div>

      {/* COMMENTS */}

      <div
        className="reviews-list"
        style={{
          display: 'flex',
          flexDirection:
            'column',
          gap: '1rem',
        }}
      >
        {comments.length === 0 &&
          !loading && (
            <div
              style={{
                textAlign:
                  'center',

                padding: '2rem',

                borderRadius:
                  '16px',

                background:
                  'var(--bg-card)',

                border:
                  '1px solid var(--border-color)',

                color:
                  'var(--text-secondary)',
              }}
            >
              No reviews yet.
            </div>
          )}

        {comments.map(
          (comment) => (
            <div
              key={comment.id}
              style={{
                background:
                  'var(--bg-card)',

                border:
                  '1px solid var(--border-color)',

                borderRadius:
                  '18px',

                padding: '1.4rem',
              }}
            >
              {/* TOP */}

              <div
                style={{
                  display: 'flex',

                  justifyContent:
                    'space-between',

                  alignItems:
                    'center',

                  marginBottom:
                    '1rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems:
                      'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '42px',

                      height: '42px',

                      borderRadius:
                        '50%',

                      background:
                        'var(--primary)',

                      color: '#fff',

                      display: 'flex',

                      alignItems:
                        'center',

                      justifyContent:
                        'center',

                      fontWeight:
                        '700',
                    }}
                  >
                    {comment.userName
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>

                  <div>
                    <div
                      style={{
                        color:
                          'var(--text-primary)',

                        fontWeight:
                          '600',

                        fontSize:
                          '0.95rem',
                      }}
                    >
                      {
                        comment.userName
                      }
                    </div>

                    <div
                      style={{
                        color:
                          'var(--text-secondary)',

                        fontSize:
                          '0.8rem',
                      }}
                    >
                      {new Date(
                        comment.createdAt
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    color:
                      'var(--primary)',

                    fontSize:
                      '1rem',
                  }}
                >
                  {'★'.repeat(
                    comment.rating
                  )}
                </div>
              </div>

              {/* CONTENT */}

              <p
                style={{
                  color:
                    'var(--text-secondary)',

                  lineHeight:
                    '1.7',

                  margin: 0,

                  fontSize:
                    '0.92rem',
                }}
              >
                {comment.content}
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
}