import { SliceComponentProps } from '@prismicio/react';
import { FC } from 'react';
import type { FeaturedBadgeSlice } from '../../prismicio-types';

/**
 * Props for `FeaturedBadge`.
 */
export type FeaturedBadgeProps = SliceComponentProps<FeaturedBadgeSlice>;

/**
 * Component for "FeaturedBadge" Slices.
 */
const FeaturedBadge: FC<FeaturedBadgeProps> = ({ slice }) => {
  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      Placeholder component for featured_badge (variation: {slice.variation}) slices.
      <br />
      <strong>You can edit this slice directly in your code editor.</strong>
      {/**
       * 💡 Use the Prismic MCP server with your code editor
       * 📚 Docs: https://prismic.io/docs/ai#code-with-prismics-mcp-server
       */}
    </section>
  );
};

export default FeaturedBadge;

