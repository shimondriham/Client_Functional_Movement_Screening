import { useNavigate } from 'react-router-dom';

function PerformanceAnalysis() {
  const navigate = useNavigate();
  const score = 80; // placeholder value, replace with real data

  const goHome = () => navigate('/dashboard');
  const onDownload = () => {
    window.print();
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ padding: 24, background: '#f7f7f7' }}>
      <div
        className="container bg-white position-relative"
        style={{
          maxWidth: 1000,
          border: '6px solid #f0f0f0',
          padding: 48,
        }}
      >
        {/* Home button */}
        <button
          type="button"
          onClick={goHome}
          aria-label="Home"
          title="Home"
          className="position-absolute"
          style={{
            left: 20,
            top: 20,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 6,
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-hidden="true"
          >
            <path
              d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5z"
              fill="#333"
            />
            <path d="M9 21V13h6v8" fill="#333" opacity="0.0" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center pt-2">
          <div className="mb-4">
            <div className="fs-5 text-dark">Logo</div>
          </div>

          <div className="mt-4">
            <div className="fs-5 text-dark mb-2">Your result is:</div>
            <div className="fw-bold" style={{ fontSize: 64, color: '#111' }}>
              {score}%
            </div>
          </div>

          <p
            className="mx-auto mt-4 mb-4 text-secondary"
            style={{ maxWidth: 760, lineHeight: 1.6 }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
            porttitor, velit et gravida faucibus, diam magna rutrum lectus,
            luctus blandit enim leo eleifend leo. Phasellus urna justo, porta id
            semper eget, iaculis nec leo. Interdum et malesuada fames ac ante
            ipsum primis in faucibus. Vestibulum sceli et luctus
          </p>
        </div>

        {/* Download button */}
        <div className="position-absolute" style={{ right: 24, bottom: 24 }}>
          <button
            type="button"
            onClick={onDownload}
            className="btn"
            style={{
              padding: '12px 22px',
              border: '2px solid #d9d9d9',
              background: '#fff',
              cursor: 'pointer',
              fontSize: 16,
            }}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default PerformanceAnalysis;
