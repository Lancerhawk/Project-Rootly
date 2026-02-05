import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Rootly - Surface Production Errors in Your IDE',
    description: 'Developer platform for understanding production failures',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
