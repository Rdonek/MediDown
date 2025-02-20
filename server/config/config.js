export const config = {
    port: process.env.PORT || 3000,
    ytdlpOptions: {
        format: 'best',
        dumpJson: true,
        noWarnings: true,
        verbose: true
    }
}; 