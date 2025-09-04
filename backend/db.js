import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./quiz.db");

// Create tables if not exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      difficulty TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id INTEGER,
      question TEXT,
      options TEXT,
      correct INTEGER,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
    )
  `);
});

// Insert sample data if empty
db.get("SELECT COUNT(*) as count FROM quizzes", (err, row) => {
  if (row.count === 0) {
    console.log("Seeding database...");

    db.run(`INSERT INTO quizzes (title, description, difficulty) VALUES 
      ('Basic Math', 'Simple arithmetic questions', 'easy'),
      ('Colors & Shapes', 'Basic knowledge about colors and shapes', 'easy'),
      ('World Geography', 'Countries and capitals', 'medium'),
      ('Science Basics', 'Fundamental science concepts', 'medium'),
      ('Advanced Physics', 'Complex physics concepts', 'hard'),
      ('Advanced Mathematics', 'Complex mathematical concepts', 'hard')
    `);

    db.run(`INSERT INTO questions (quiz_id, question, options, correct) VALUES
      (1, 'What is 2 + 2?', '["3","4","5","6"]', 1),
      (1, 'What is 10 - 3?', '["6","7","8","9"]', 1),
      (1, 'What is 5 × 2?', '["8","10","12","15"]', 1),
      (1, 'What is 15 ÷ 3?', '["4","5","6","7"]', 1),
      (1, 'What is 8 + 7?', '["14","15","16","17"]', 1),
      (1, 'What is 9 × 9?', '["72","81","99","90"]', 1),
      (1, 'What is 12 ÷ 4?', '["2","3","4","6"]', 1),
      (1, 'What is 7 + 6?', '["11","12","13","14"]', 2),
      (1, 'What is 20 - 8?', '["10","11","12","13"]', 2),
      (1, 'What is 3 × 7?', '["18","20","21","24"]', 2),
      
      
      (2, 'What color do you get when you mix red and yellow?', '["Purple","Orange","Green","Blue"]', 1),
      (2, 'How many sides does a triangle have?', '["2","3","4","5"]', 1),
      (2, 'What is the primary color that is not red or blue?', '["Green","Yellow","Purple","Orange"]', 1),
      (2, 'How many sides does a square have?', '["3","4","5","6"]', 1),
      (2, 'What color do you get when you mix blue and yellow?', '["Purple","Orange","Green","Red"]', 2),
      (2, 'Which shape has no corners?', '["Triangle","Circle","Rectangle","Square"]', 1),
      (2, 'What is the color of the sky on a clear day?', '["Blue","Green","Red","Yellow"]', 0),
      (2, 'Which shape has 5 sides?', '["Pentagon","Hexagon","Octagon","Square"]', 0),
      (2, 'What two colors make purple?', '["Blue and Red","Red and Green","Yellow and Blue","Orange and Green"]', 0),
      (2, 'Which shape looks like a ball?', '["Circle","Sphere","Cube","Pyramid"]', 1),

      
      (3, 'What is the capital of France?', '["London","Berlin","Paris","Madrid"]', 2),
      (3, 'Which continent is Brazil located in?', '["Asia","South America","Africa","Europe"]', 1),
      (3, 'What is the largest ocean on Earth?', '["Atlantic","Pacific","Indian","Arctic"]', 1),
      (3, 'Which country has the most natural lakes?', '["Russia","Canada","USA","Finland"]', 1),
      (3, 'What is the smallest country in the world?', '["Monaco","Vatican City","San Marino","Liechtenstein"]', 1),
      (3, 'Which desert is the largest in the world?', '["Sahara","Gobi","Kalahari","Arabian"]', 0),
      (3, 'Mount Everest is located in which mountain range?', '["Alps","Andes","Himalayas","Rockies"]', 2),
      (3, 'Which river flows through Egypt?', '["Amazon","Nile","Yangtze","Ganges"]', 1),
      (3, 'What is the capital city of Japan?', '["Seoul","Beijing","Tokyo","Kyoto"]', 2),
      (3, 'Which country is known as the Land of the Rising Sun?', '["China","Japan","Thailand","South Korea"]', 1),
      
      
      (4, 'What gas do plants absorb from the atmosphere?', '["Oxygen","Carbon Dioxide","Nitrogen","Hydrogen"]', 1),
      (4, 'How many bones are in the adult human body?', '["196","206","216","226"]', 1),
      (4, 'What planet is known as the Red Planet?', '["Venus","Mars","Jupiter","Saturn"]', 1),
      (4, 'What is the chemical symbol for water?', '["H2","O2","H2O","HO2"]', 2),
      (4, 'Which organ pumps blood in the human body?', '["Lungs","Liver","Heart","Kidneys"]', 2),
      (4, 'What is the center of an atom called?', '["Nucleus","Proton","Electron","Neutron"]', 0),
      (4, 'What force keeps us on the ground?', '["Friction","Gravity","Magnetism","Inertia"]', 1),
      (4, 'What is the boiling point of water at sea level?', '["90°C","100°C","110°C","120°C"]', 1),
      (4, 'Which gas do humans exhale?', '["Oxygen","Carbon Dioxide","Nitrogen","Hydrogen"]', 1),
      (4, 'What part of the plant makes food?', '["Stem","Root","Leaf","Flower"]', 2),
      
      
      (5, 'What is the uncertainty principle in quantum mechanics?', '["Energy-time","Position-momentum","Both A and B","Neither"]', 2),
      (5, 'What is the value of Planck''s constant?', '["6.626e-34 J·s","6.626e-24 J·s","6.626e-14 J·s","6.626e-4 J·s"]', 0),
      (5, 'In relativity, what happens to time as velocity nears light speed?', '["Speeds up","Slows down","Constant","Reverses"]', 1),
      (5, 'What is the Schwarzschild radius?', '["Neutron star radius","Event horizon of a black hole","Observable universe","Nearest star distance"]', 1),
      (5, 'What particle mediates the weak nuclear force?', '["Photon","Gluon","W and Z bosons","Higgs boson"]', 2),
      (5, 'Which equation describes mass-energy equivalence?', '["F=ma","E=mc²","PV=nRT","ΔE=hν"]', 1),
      (5, 'What is the speed of light in vacuum?', '["3×10^5 km/s","3×10^8 m/s","1.5×10^8 m/s","6×10^8 m/s"]', 1),
      (5, 'What does a Geiger counter detect?', '["Heat","Radiation","Magnetism","Sound"]', 1),
      (5, 'What is the unit of electric resistance?', '["Watt","Ampere","Volt","Ohm"]', 3),
      (5, 'Who developed the laws of motion?', '["Einstein","Newton","Galileo","Bohr"]', 1),
      
      
      (6, 'What is the derivative of ln(x)?', '["x","1/x","ln(x)","e^x"]', 1),
      (6, 'What is Euler''s identity?', '["e^(iπ) + 1 = 0","e^(iπ) - 1 = 0","e^(iπ) = 1","e^(iπ) = -1"]', 0),
      (6, 'What is the integral of 1/x dx?', '["x²/2","ln|x| + C","1/x² + C","e^x + C"]', 1),
      (6, 'What is the value of the golden ratio φ?', '["1.414...","1.618...","2.718...","3.141..."]', 1),
      (6, 'What is the sum of the infinite series 1 + 1/2 + 1/4 + ...?', '["1","2","∞","π"]', 1),
      (6, 'What is the determinant of [[1,2],[3,4]]?', '["-2","-1","2","1"]', 0),
      (6, 'What is the limit of (1 + 1/n)^n as n→∞?', '["π","e","∞","0"]', 1),
      (6, 'Solve: ∫0^π sin(x) dx', '["0","1","2","-1"]', 2),
      (6, 'What is the Laplace transform of 1?', '["1/s","s","e^s","s^2"]', 0),
      (6, 'Which function is its own derivative?', '["x^2","e^x","ln(x)","sin(x)"]', 1)

    `);
  }
});

export default db;
