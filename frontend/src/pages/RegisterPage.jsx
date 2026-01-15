import RegisterForm from '../components/Auth/RegisterForm';

export default function RegisterPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Join SplitMint</h1>
                    <p className="text-gray-500 mt-2">Create your free account</p>
                </div>

                <div className="card-premium p-8 bg-white shadow-lg">
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}
