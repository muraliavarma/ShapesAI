# Shapes - An AI-Powered Unity Puzzle Game

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A unique Unity3D puzzle game where players collaborate with an AI companion to solve shape-based puzzles. The game features an innovative Autonomous Companion Character that learns from human interactions and adapts its behavior accordingly.

[Play the Game](http://murlax.com/shapes) (requires Unity Web Player)

## 🎮 Features

- **Intelligent AI Companion**: An adaptive AI that learns from player actions and provides strategic assistance
- **Multiple Puzzle Types**: Various challenges involving shape manipulation
- **Interactive Learning**: AI learns 4 core actions from the player:
  - Merging shapes
  - Splitting shapes
  - Fountain of Life interaction
  - Fountain of Death interaction
- **Dynamic Behavior Tree**: AI uses sophisticated behavior trees to analyze and solve puzzles
- **Multiple Game Scenes**: Progressive difficulty across different levels
- **Smart Object Interaction**: AI can interact with doors, puzzles, and other environmental elements

## 🧠 AI System Overview

The AI system is built on a sophisticated behavior tree architecture that:
- Analyzes exit conditions from smart objects
- Generates possible solution paths (up to depth 20)
- Presents up to 10 possible solutions to the player
- Executes autonomous actions and follows player when needed
- Learns from player interactions to improve decision making

## 🛠️ Technical Stack

- **Game Engine**: Unity3D
- **Scripting**: JavaScript/UnityScript, C#
- **AI Implementation**: Custom behavior tree system
- **Core Files**: Main AI logic in `AIMemoryScript.js`

## 📁 Project Structure

```
Assets/
├── Scripts/         # Core game scripts including AI implementation
├── Prefabs/         # Reusable game objects
├── Materials/       # Game materials and textures
└── Scene[0-3].unity # Different game levels
```

## 🚀 Getting Started

### Prerequisites
- Unity3D (compatible version)
- Basic understanding of Unity game development

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/muraliavarma/ShapesAI.git
   ```
2. Open the project in Unity
3. Load Scene0.unity to start from the beginning

## 🎯 How to Play

1. Start with the tutorial level to learn basic mechanics
2. Teach the AI companion the four basic actions
3. Collaborate with the AI to solve increasingly complex puzzles
4. Use the AI's suggestions to find optimal solutions
5. Progress through multiple levels with increasing difficulty

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

- **Murali Varma**
  - Website: [murlax.com](http://murlax.com)
  - GitHub: [@muraliavarma](https://github.com/muraliavarma)

## 🙏 Acknowledgments

Special thanks to all contributors and testers who helped shape this unique gaming experience.