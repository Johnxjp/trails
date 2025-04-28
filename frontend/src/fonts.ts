import localFont from 'next/font/local';

export const satoshi_sans = localFont({
    display: 'swap',
    // subsets: ['sans-serif'],
    variable: '--font-satoshi',
    fallback: ['system-ui', 'sans-serif'],
    // weight: ['300', '400', '500', '700', '900'],
    src: [
        {
            path: './fonts/Satoshi-Light.woff2',
            weight: '300',
            style: 'normal',
        },
        {
            path: './fonts/Satoshi-LightItalic.woff2',
            weight: '300',
            style: 'italic',
        },
        {
            path: './fonts/Satoshi-Regular.woff2',
            weight: '400',
            style: 'normal'
        },
        {
            path: './fonts/Satoshi-Italic.woff2',
            weight: '400',
            style: 'italic'
        },
        {
            path: './fonts/Satoshi-Medium.woff2',
            weight: '500',
            style: 'normal'
        },
        {
            path: './fonts/Satoshi-MediumItalic.woff2',
            weight: '500',
            style: 'italic'
        },
        {
            path: './fonts/Satoshi-Bold.woff2',
            weight: '700',
            style: 'normal'
        },
        {
            path: './fonts/Satoshi-BoldItalic.woff2',
            weight: '700',
            style: 'italic'
        },
        {
            path: './fonts/Satoshi-Black.woff2',
            weight: '900',
            style: 'normal'
        },
        {
            path: './fonts/Satoshi-BlackItalic.woff2',
            weight: '900',
            style: 'italic'
        },
        {
            path: './fonts/Satoshi-Variable.woff2',
            weight: '300 900',
            style: 'normal'
        },
        {
            path: './fonts/Satoshi-VariableItalic.woff2',
            weight: '300 900',
            style: 'italic'
        }
    ]
})