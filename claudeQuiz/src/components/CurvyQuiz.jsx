import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const quizData = [
    {
        id: 1,
        question: "Given a string representing a number, return the closest number that is a palindrome.",
        correctAnswer: "Some other pattern"
    },
    {
        id: 2,
        question: "Given an array of numbers in the range 1 to n, find all the numbers that are missing in the array.",
        correctAnswer: "Cyclic Sort"
    },
    {
        id: 3,
        question: "Given a set of numbers, find the first 5 missing positive numbers.",
        correctAnswer: "Some other pattern"
    },
    {
        id: 4,
        question: "Given a set, return the number of subsets with the sum equal to 10.",
        correctAnswer: "Some other pattern"
    }
];

const answerOptions = [
    "Cyclic Sort",
    "Some other pattern"
];

const ColumnMatchingQuiz = () => {
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [matches, setMatches] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const questionRefs = useRef([]);
    const answerRefs = useRef([]);

    useEffect(() => {
        questionRefs.current = questionRefs.current.slice(0, quizData.length);
        answerRefs.current = answerRefs.current.slice(0, answerOptions.length);
    }, []);

    const handleQuestionClick = (questionId) => {
        setSelectedQuestion(questionId);
    };

    const handleAnswerClick = (answer) => {
        if (selectedQuestion !== null) {
            setMatches(prev => ({ ...prev, [selectedQuestion]: answer }));
            setSelectedQuestion(null);
        }
    };

    const handleSubmit = () => {
        let correctAnswers = 0;
        quizData.forEach(item => {
            if (matches[item.id] === item.correctAnswer) {
                correctAnswers++;
            }
        });
        setScore(correctAnswers);
        setShowResults(true);
    };

    const resetQuiz = () => {
        setMatches({});
        setShowResults(false);
        setScore(0);
        setSelectedQuestion(null);
    };

    const createCurvedPath = (x1, y1, x2, y2) => {
        const midX = (x1 + x2) / 2;
        return `M ${x1} ${y1} Q ${midX} ${y1}, ${midX} ${(y1 + y2) / 2} T ${x2} ${y2}`;
    };

    return (
        <div className="max-w-6xl mx-auto p-4 bg-gray-900 text-white">
            <div className="bg-gray-800 p-2 mb-4 rounded">
                <p>Select an option from the left-hand side</p>
            </div>
            <div className="flex justify-between relative">
                <div className="w-5/12">
                    {quizData.map((item, index) => (
                        <div
                            key={item.id}
                            ref={el => questionRefs.current[index] = el}
                            className={`p-4 mb-4 rounded cursor-pointer ${selectedQuestion === item.id ? 'bg-blue-600' : 'bg-gray-700'} ${matches[item.id] ? 'border-2 border-green-500' : ''}`}
                            onClick={() => handleQuestionClick(item.id)}
                        >
                            <p>{item.question}</p>
                            <p className="text-blue-300 mt-2">Explanation</p>
                        </div>
                    ))}
                </div>
                <div className="w-5/12">
                    {answerOptions.map((answer, index) => (
                        <div
                            key={answer}
                            ref={el => answerRefs.current[index] = el}
                            className="p-4 mb-4 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
                            onClick={() => handleAnswerClick(answer)}
                        >
                            <p>{answer}</p>
                        </div>
                    ))}
                </div>
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7"
                            refX="0" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#4299e1" />
                        </marker>
                    </defs>
                    {Object.entries(matches).map(([questionId, answer]) => {
                        const questionIndex = quizData.findIndex(q => q.id === parseInt(questionId));
                        const answerIndex = answerOptions.indexOf(answer);
                        const questionEl = questionRefs.current[questionIndex];
                        const answerEl = answerRefs.current[answerIndex];
                        if (questionEl && answerEl) {
                            const questionRect = questionEl.getBoundingClientRect();
                            const answerRect = answerEl.getBoundingClientRect();
                            const path = createCurvedPath(
                                questionRect.right,
                                questionRect.top + questionRect.height / 2,
                                answerRect.left,
                                answerRect.top + answerRect.height / 2
                            );
                            return (
                                <path
                                    key={questionId}
                                    d={path}
                                    fill="none"
                                    stroke="#4299e1"
                                    strokeWidth="2"
                                    markerEnd="url(#arrowhead)"
                                />
                            );
                        }
                        return null;
                    })}
                </svg>
            </div>
            {!showResults ? (
                <button
                    onClick={handleSubmit}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Submit
                </button>
            ) : (
                <div className="mt-4">
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Quiz Results</AlertTitle>
                        <AlertDescription>
                            Your score: {score} out of {quizData.length}
                        </AlertDescription>
                    </Alert>
                    <button
                        onClick={resetQuiz}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default ColumnMatchingQuiz;