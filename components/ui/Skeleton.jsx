export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="skeleton rounded-lg"
          style={{
            height: '16px',
            width: i === lines - 1 ? '60%' : '100%'
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`card ${className}`}>
      <div className="skeleton w-12 h-12 rounded-lg mb-4" />
      <div className="skeleton h-6 w-3/4 rounded mb-3" />
      <div className="skeleton h-4 w-full rounded mb-2" />
      <div className="skeleton h-4 w-5/6 rounded" />
    </div>
  );
}

export function SkeletonAvatar({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-20 h-20', xl: 'w-32 h-32' };
  return <div className={`skeleton ${sizes[size]} rounded-full ${className}`} />;
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6 p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="skeleton h-10 w-28 rounded-lg" />
        ))}
      </div>
      <div className="card">
        <div className="skeleton h-40 w-full rounded-lg mb-4" />
        <div className="flex justify-between">
          <div className="skeleton h-4 w-20 rounded" />
          <div className="flex gap-3">
            <div className="skeleton h-10 w-24 rounded-lg" />
            <div className="skeleton h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>
      <SkeletonCard />
    </div>
  );
}
