export const useEndpoints = () => {
    const apiBase = useAppConfig().site.apiBase ? `${useAppConfig().site.apiBase}` : 'http://localhost:8000'

    return {
        main: {
            contact: `${apiBase}/api/main/contact`,
            join: `${apiBase}/api/main/join`,
        },
        leadership: {
            team: `${apiBase}/api/leadership/team`,
            faculty: `${apiBase}/api/leadership/faculty`,
            leads: `${apiBase}/api/leadership/lead`
        },
        resources: {
            repos: `${apiBase}/api/resources/repos`,
            learning: `${apiBase}/api/resources/learning`,
            certifications: `${apiBase}/api/resourcces/certifications`,
            recordedWorkshops: `${apiBase}/api/resources/recorded-workshops`,
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
