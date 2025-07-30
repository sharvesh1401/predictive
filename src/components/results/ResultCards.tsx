import React from 'react';
import { motion } from 'framer-motion';

interface ResultCardProps {
  title: string;
  value: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, value }) => {
  return (
    <div className="bg-card p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

const ResultCards: React.FC = () => {
  const results = [
    { title: 'Distance', value: '123 km' },
    { title: 'Time', value: '2h 30m' },
    { title: 'Energy', value: '45 kWh' },
    { title: 'Emissions', value: '0 g/km' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {results.map((result) => (
        <motion.div variants={item} key={result.title}>
          <ResultCard {...result} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ResultCards;
