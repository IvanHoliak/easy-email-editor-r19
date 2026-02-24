/**
 * Transforms Arco Design CSS by replacing the default `.arco-` class prefix
 * with `.ee-` to match the `prefixCls="ee"` ConfigProvider setting.
 *
 * This prevents the library's Arco styles from conflicting with the host
 * application's own Arco (or other) CSS.
 *
 * Usage:
 * ```ts
 * import arcoCss from '@arco-themes/react-easy-email-theme/css/arco.css?inline';
 * import { transformArcoCSS } from '@ivanholiak/easy-email-editor';
 *
 * <style>{transformArcoCSS(arcoCss)}</style>
 * ```
 */
export function transformArcoCSS(css: string): string {
  return css
    .replace(/\.arco-/g, '.ee-')
    .replace(/\[class\*=arco-/g, '[class*=ee-')
    .replace(/arco-theme/g, 'ee-theme');
}
