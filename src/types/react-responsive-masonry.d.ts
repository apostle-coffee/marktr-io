declare module 'react-responsive-masonry' {
  import * as React from 'react';

  export interface ResponsiveMasonryProps {
    columnsCountBreakPoints: Record<number, number>;
    children: React.ReactNode;
  }

  export interface MasonryProps {
    gutter?: string;
    children: React.ReactNode;
  }

  export const ResponsiveMasonry: React.FC<ResponsiveMasonryProps>;
  
  const Masonry: React.FC<MasonryProps>;
  export default Masonry;
}

