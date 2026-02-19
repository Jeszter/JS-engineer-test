import Link from 'next/link';

const features = [
    {
        title: 'Boolean',
        description: 'True/False questions',
        icon: '◉'
    },
    {
        title: 'Text Input',
        description: 'Short answer questions',
        icon: '✎'
    },
    {
        title: 'Checkbox',
        description: 'Multiple correct answers',
        icon: '☐'
    }
];

export default function Home() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 fade-in">
                <h1 className="text-5xl font-bold gradient-text mb-4">
                    Abstract Inspiration
                </h1>
                <p className="text-xl text-[#605550] mb-8 max-w-2xl mx-auto">
                    Create elegant quizzes with our minimalist builder.
                    Three question types, infinite possibilities.
                </p>

                <div className="flex justify-center gap-4">
                    <Link href="/create" className="btn-primary">
                        Create a Quiz
                    </Link>
                    <Link href="/quizzes" className="btn-secondary">
                        View Quizzes
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                    <div key={index} className="card text-center group">
                        <div className="text-3xl mb-3 text-[#605550] group-hover:scale-110 transition-transform duration-300">
                            {feature.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-[#605550] mb-2">
                            {feature.title}
                        </h3>
                        <p className="text-[#95867B] text-sm">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center text-[#605550] text-sm opacity-60">
            </div>
        </div>
    );
}