Shapes
========

This is a Unity3D game where the player has to collaborate with AI to solve puzzles by merging and splitting shapes. In this game, we have implemented an ```Autonomous Companion Character``` that ```Learns From Humans```.

The main AI file is the [AIMemoryScript.js file](https://github.com/muraliavarma/ShapesAI/blob/master/Assets/Scripts/AIMemoryScript.js). This is contained in the [Scripts folder](https://github.com/muraliavarma/ShapesAI/blob/master/Assets/Scripts) which contains all the JavaScript files for the project.

Overview of AI
-----
The player can teach 4 actions to the AI - Merging, Splitting, Fountain of Life, Fountain of Death. When the AI reaches a smart object (such as a door or a puzzle that requries a shape to be matched), it provides the AI with some exit conditions. This is put into a behavior tree that the AI uses to generate possible nodes that have this exit as its postcondition. If any of these nodes match with the current world state, the AI spits out the path from this node to the exit as a possible option. If not, we generate more nodes and go upto a max depth of 20 and display a maximum of 10 options. The player chooses one of these options and the AI executes all the steps that it can (such as going to a fountain). If there are options to be executed by the player, the AI simply follows the player.