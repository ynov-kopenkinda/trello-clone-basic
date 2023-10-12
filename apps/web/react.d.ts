import 'react';

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style -- interface mergig, not override
    interface CSSProperties {
        [key: `--${string}`]: string | number
    }
}