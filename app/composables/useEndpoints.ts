export const useEndpoints = () => {
    const apiBase = useAppConfig().site.apiBase ? `${useAppConfig().site.apiBase}` : 'http://localhost:8000'

    return {
        utilities: {

        },
        highlights: {

        },
        events: {
            list: `${apiBase}/api/events`
        },
        reviews: {
            list: `${apiBase}/api/reviews`

        },
        projects: {
            list: `${apiBase}/api/projects`
        }
    };

}
