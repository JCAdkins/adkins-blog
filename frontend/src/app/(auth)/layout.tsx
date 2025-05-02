const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="relative h-dvh">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-transparent rounded-lg shadow-lg">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
