export const useEndpoints = () => {
    const apiBase = useAppConfig().site.apiBase ? `${useAppConfig().site.apiBase}` : 'http://localhost:8000'

    return {
        auth: {
            verifyEmail: `${apiBase}/api/auth/verify-email/`,
            resendVerification: `${apiBase}/api/auth/resend-code/`,
            loginWithGoogle: `${apiBase}/api/auth/google/login/`,
            login: `${apiBase}/auth/jwt/create/`

        },
        main: {
            contact: `${apiBase}/api/contact-messages/`,
            join: `${apiBase}/api/auth/signup/`,
            joinDetails: ``
        },
        leadership: {
            team: `${apiBase}/api/leadership/`,
            faculty: `${apiBase}/api/leadership/`,
            leads: `${apiBase}/api/leadership/`
        },
        resources: {
            main: `${apiBase}/api/resources`,
            repos: `${apiBase}/api/resources/repos`,
            learning: `${apiBase}/api/resources/learning`,
            certifications: `${apiBase}/api/resourcces/certifications`,
            recordedWorkshops: `${apiBase}/api/resources/recorded-workshops`,
        },
        utilities: {

        },
        takeaways: {
            list: `${apiBase}/api/takeaways/`,
        },
        highlights: {

        },
        events: {
            list: `${apiBase}/api/events/`,
            past: `${apiBase}/api/events/past/list`
        },
        reviews: {
            list: `${apiBase}/api/testimonials`
        },
        projects: {
            list: `${apiBase}/api/projects/`
        },
        gallery: {
            list: `${apiBase}/api/galleries/`,
            event: `${apiBase}/api/galleries/by-event/`,
            featured: `${apiBase}/api/galleries/featured/`,
            unliked: `${apiBase}/api/galleries/unlinked/`,
        },
        payments: {
            membership_initiate: `${apiBase}/api/membership-payments/initiate/`,
            un_auth_status: `${apiBase}/api/membership-payments/check-status/`,
            status: (checkout_request_id: string) => `${apiBase}/api/payments/status/${checkout_request_id}/`,
            event_initiate: `${apiBase}/api/event-payments/initiate/`,
        }
    };

}
