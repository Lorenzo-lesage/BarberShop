import AppShell from '@/Layouts/Appshell';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function ProfileEdit({
    mustVerifyEmail,
    status,
    isOAuth,
}: PageProps<{
    mustVerifyEmail: boolean;
    status?: string;
    isOAuth: boolean;
}>) {
    return (
        <AppShell>
            <header className="bg-white shadow dark:bg-gray-700">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Profile
                    </h2>
                </div>
            </header>
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Update Profile Info */}
                    <div className="bg-white p-4 shadow dark:bg-gray-700 sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* Update Password - Only for non-OAuth users */}
                    {!isOAuth && (
                        <div className="bg-white p-4 shadow dark:bg-gray-700 sm:rounded-lg sm:p-8">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>
                    )}

                    {/* Delete Account */}
                    <div className="bg-white p-4 shadow dark:bg-gray-700 sm:rounded-lg sm:p-8">
                        <DeleteUserForm
                            className="max-w-xl"
                            isOAuth={isOAuth}
                        />
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
