import * as React from 'react';
import { ViewProps } from './view';

export interface LinkOptions {
  /**
   * @description
   * Children to be rendered inside the Link component
   */
  children: React.ReactNode;

  /**
   * @description
   * Boolean value indicating an external link
   * sets the rel attribute to "noopener noreferrer"
   */
  isExternal?: boolean;

  /**
   * @description
   * A string representation of the URL path
   */
  to?: string;

  /**
   * @description
   * a stringifier that returns a string containing the whole URL, and allows the href to be updated.
   * @see
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/href)
   */
  href?: string;
}

export interface LinkProps extends ViewProps, LinkOptions {}
