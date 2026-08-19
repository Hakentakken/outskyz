interface PageContainerProps {
  children: React.ReactNode;
}

/**
 * Wraps page content pushed below the fixed header.
 */
export function PageContainer({ children }: PageContainerProps) {
  return <div className="pt-20">{children}</div>;
}