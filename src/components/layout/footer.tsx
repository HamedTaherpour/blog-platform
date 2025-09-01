import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <Link href="/" className="text-xl font-bold text-primary">
            Conduit
          </Link>
          <p className="text-muted-foreground text-sm">
            An interactive learning project from{' '}
            <a 
              href="https://thinkster.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Thinkster
            </a>
            . Code & design licensed under MIT.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
