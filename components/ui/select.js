export function Select({ children, ...props }) {
    return <select className="p-2 border rounded w-full" {...props}>{children}</select>;
  }
  