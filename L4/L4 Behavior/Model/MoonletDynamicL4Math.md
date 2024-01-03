### Gravitational Force Calculation

The force between two masses due to gravity is given by Newton's law of gravitation:

![img.png](img.png)

Where:
- ![img_1.png](img_1.png) is the gravitational force,
- ![img_2.png](img_2.png) is the gravitational constant,
- ![img_3.png](img_3.png) and ![img_4.png](img_4.png) are the masses of the two objects,
- ![img_5.png](img_5.png) is the distance between the centers of the masses.

### Equations of Motion

The differential equations that describe the motion of each moonlet are derived from Newton's second law:

![img_6.png](img_6.png)

For each moonlet, we have four differential equations:

1. ![img_7.png](img_7.png)
2. ![img_8.png](img_8.png) (position y1)
3. ![img_9.png](img_9.png) (velocity x1)
4. ![img_10.png](img_10.png) (velocity y1)

5. ![img_11.png](img_11.png) (position x2)
6. ![img_12.png](img_12.png) (position y2)
7. ![img_13.png](img_13.png) (velocity x2)
8. ![img_14.png](img_14.png) (velocity y2)

Where:
- ![img_15.png](img_15.png) are the positions of the first moonlet,
- ![img_16.png](img_16.png) are its velocities,
- ![img_17.png](img_17.png) are the gravitational forces acting on the first moonlet,
- ![img_18.png](img_18.png) is the mass of the first moonlet.
- Similar expressions hold for the second moonlet.

### Gravitational Forces Between Moonlets

In the equations, ![img_19.png](img_19.png) represent the gravitational forces between moonlets. The forces are calculated as follows:

- ![img_20.png](img_20.png) are the gravitational forces on moonlet 1 due to the Earth and moonlet 2.
- ![img_21.png](img_21.png) are the gravitational forces on moonlet 2 due to the Earth and moonlet 1.

The positions used to calculate the distances between the moonlets and the Earth are adjusted for the relative positions of the moonlets.

### Simulation

The `odeint` function is then used to solve these differential equations numerically over a specified time span, and the resulting positions and velocities are recorded at discrete time intervals. The simulation advances in time steps, updating the positions and velocities based on the gravitational interactions between the Earth and moonlets and between the moonlets themselves.