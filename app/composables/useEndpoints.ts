import { slug } from "valibot";

export const useEndpoints = () => {
    const apiBase = useAppConfig().site.apiBase ? `${useAppConfig().site.apiBase}` : 'http://localhost:8000'

    return {
        auth: {
            verifyEmail: `${apiBase}/api/auth/verify-email/`,
            resendVerification: `${apiBase}/api/auth/resend-code/`,
            loginWithGoogle: `${apiBase}/api/auth/google/login/`,
            login: `${apiBase}/auth/jwt/create/`,
            setPassword: `${apiBase}/api/auth/set-password/`,
            changePassword: `${apiBase}/api/auth/reset-password/`,
            initiateSetupPassword: `${apiBase}/api/auth/resend-password-setup/`,
            initiateChangePassword: `${apiBase}/api/auth/forgot-password/`,
            userProfile: `${apiBase}/api/users/me/`,
            refreshToken: `${apiBase}/auth/jwt/refresh/`,
        },
        main: {
            contact: `${apiBase}/api/contact-messages/`,
            join: `${apiBase}/api/auth/signup/`,
            joinDetails: ``,
            developers: `${apiBase}/api/developers/`,
            developersStats: `${apiBase}/api/developers/statistics/`,
            homme_gallery: `${apiBase}/api/galleries/home/`,
            home_data: `${apiBase}/api/home/`,
            config_info: `${apiBase}/api/config/`,
            home_gallery: `${apiBase}/api/galleries/home/`,
            update_suggestions: `${apiBase}/api/suggestions/`,
            get_suggestions: `${apiBase}/api/suggestions/`,
            vote_suggestion: `${apiBase}/api/suggestions/vote/`, // ?suggestion_id=123
            support: `${apiBase}/api/support-ticket/create/`,
            terms: `${apiBase}/api/terms/`,
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
            past: `${apiBase}/api/events/past/list`,
            register: `${apiBase}/api/event-attendances/register/`,

        },
        eventPayments: {
            initiate: `${apiBase}/api/event-payments/initiate/`,
            checkStatus: `${apiBase}/api/event-payments/check-status/`,
            simulate: `${apiBase}/api/event-payments/simulate/`,
            myPayments: `${apiBase}/api/event-payments/my-payments/`,
        },
        eventAttendances: {
            register: `${apiBase}/api/event-attendances/register/`,
            myRegistrations: `${apiBase}/api/event-attendances/my-registrations/`,
            // ... other attendance endpoints
        },
        reviews: {
            list: `${apiBase}/api/testimonials`
        },
        projects: {
            list: `${apiBase}/api/projects/`
        },
        gallery: {
            list: `${apiBase}/api/galleries/`,
            slug: (slug: string) => `${apiBase}/api/galleries/${slug}/`,
            event: `${apiBase}/api/galleries/search-by-event/`,
            featured: `${apiBase}/api/galleries/featured/`,
            unliked: `${apiBase}/api/galleries/unlinked/`,
        },
        payments: {
            membership_initiate: `${apiBase}/api/membership-payments/initiate/`,
            un_auth_status: `${apiBase}/api/membership-payments/check-status/`,
            status: (checkout_request_id: string) => `${apiBase}/api/payments/status/${checkout_request_id}/`,
            event_initiate: `${apiBase}/api/event-payments/initiate/`,
            my_payments: `${apiBase}/api/event-payments/my-payments/`
        },
        user: {
            profile: `${apiBase}/api/users/my-full-profile/`,
            updateProfile: `${apiBase}/api/users/update-profile/`,
            user: (id: string) => `${apiBase}/api/users/${id}/`,
            community: `${apiBase}/api/users/`,
            suggestions: `${apiBase}/api/users/suggestions/`,
            tickets: `${apiBase}/api/users/my-tickets/`
        },
        engineering: {
            coreDevelopers: `${apiBase}/api/developers/`,
            contributers: `${apiBase}/api/developers/contributors/`,
            statistics: `${apiBase}/api/developers/statistics/`
        }
    };

}
