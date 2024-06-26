import { registerSW } from 'virtual:pwa-register';

const intervalMS = 60 * 60 * 1000;

const updateSW = registerSW({
    onRegisteredSW(swUrl, r) {
        r && setInterval(async () => {
            if (!(!r.installing && navigator))
                return

            if (('connection' in navigator) && !navigator.onLine)
                return

            const resp = await fetch(swUrl, {
                cache: 'no-store',
                headers: {
                    'cache': 'no-store',
                    'cache-control': 'no-cache',
                },
            })

            if (resp?.status === 200)
                await r.update()
        }, intervalMS)
    },
    onNeedRefresh() {
        if (confirm("There is new content. Would you like to refresh the page?")) {
            updateSW();
        }
    },
    onOfflineReady() {
        alert("The site is ready to view offline.")
    },
});
