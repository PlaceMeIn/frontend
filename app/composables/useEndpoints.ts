export const useEndpoints = () => {
    const apiBase = useAppConfig().site.apiBase ? `${useAppConfig().site.apiBase}` : 'http://localhost:8000'

    return {
        main: {
            contact: `${apiBase}/api/contact-messages/`,
            join: `${apiBase}/api/join/`,
        },
        leadership: {
            team: `${apiBase}/api/leadership/`,
            faculty: `${apiBase}/api/leadership/`,
            leads: `${apiBase}/api/leadership/`
        },
        resources: {
            main:`${apiBase}/api/resources`,
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
            list: `${apiBase}/api/events`,
            past:`${apiBase}/api/events/past/list`
        },
        reviews: {
            list: `${apiBase}/api/testimonials`

        },
        projects: {
            list: `${apiBase}/api/projects`
        }
    };

}
