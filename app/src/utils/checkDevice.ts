function isDesktop(): boolean {
    const userAgent = navigator.userAgent

    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(userAgent)
    const isDesktop = /Windows NT|Macintosh|X11|Linux x86_64/i.test(userAgent)

    return isDesktop && !isMobile
}

export { isDesktop }