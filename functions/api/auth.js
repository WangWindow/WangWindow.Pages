export async function onRequest(context) {
    const { request, env } = context;
    const client_id = env.GITHUB_CLIENT_ID;

    try {
        const url = new URL(request.url);
        const redirectUrl = new URL('https://github.com/login/oauth/authorize');
        redirectUrl.searchParams.set('client_id', client_id);
        redirectUrl.searchParams.set('redirect_uri', url.origin + '/api/callback');
        redirectUrl.searchParams.set('scope', 'repo user');
        // simple state token (not stored server-side) — matches example; could be enhanced
        redirectUrl.searchParams.set('state', crypto.getRandomValues(new Uint8Array(12)).join(''));

        return Response.redirect(redirectUrl.href, 301);
    } catch (error) {
        console.error(error);
        return new Response(error.message || 'Auth redirect failed', {
            status: 500,
            headers: { 'content-type': 'text/plain;charset=UTF-8' },
        });
    }
}
