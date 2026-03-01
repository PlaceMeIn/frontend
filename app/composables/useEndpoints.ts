export const useEndpoints = () => {
    const apiBase = useAppConfig().site.apiBase ? `${useAppConfig().site.apiBase}` : 'http://localhost:8000'

    return {
        leadership: {
            team: `${apiBase}/api/leadership/team`,
            faculty: `${apiBase}/api/leadership/faculty`,
            leads: `${apiBase}/api/leadership/lead`

        },
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
