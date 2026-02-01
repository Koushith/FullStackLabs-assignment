import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home, Quiz, Results, Dashboard, Leaderboard, CreateQuiz } from './pages';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz/:quizId" element={<Quiz />} />
        <Route path="/results/:attemptId" element={<Results />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
      </Routes>
    </Layout>
  );
}

export default App;
