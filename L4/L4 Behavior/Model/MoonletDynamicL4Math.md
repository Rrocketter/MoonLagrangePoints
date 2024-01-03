### Gravitational Force Calculation

The force between two masses due to gravity is given by Newton's law of gravitation:

![img.png](img.png)

Where:
- \( F \) is the gravitational force,
- \( G \) is the gravitational constant,
- \( M_1 \) and \( M_2 \) are the masses of the two objects,
- \( r \) is the distance between the centers of the masses.

### Equations of Motion

The differential equations that describe the motion of each moonlet are derived from Newton's second law:

\[ F = m \cdot a \]

For each moonlet, we have four differential equations:

1. \( \frac{{dx_1}}{{dt}} = v_{x1} \) (position x1)
2. \( \frac{{dy_1}}{{dt}} = v_{y1} \) (position y1)
3. \( \frac{{dv_{x1}}}{{dt}} = \frac{{F_{x1}}}{{M_1}} + \frac{{F_{x2}}}{{M_2}} \) (velocity x1)
4. \( \frac{{dv_{y1}}}{{dt}} = \frac{{F_{y1}}}{{M_1}} + \frac{{F_{y2}}}{{M_2}} \) (velocity y1)

5. \( \frac{{dx_2}}{{dt}} = v_{x2} \) (position x2)
6. \( \frac{{dy_2}}{{dt}} = v_{y2} \) (position y2)
7. \( \frac{{dv_{x2}}}{{dt}} = \frac{{F_{x2}}}{{M_2}} + \frac{{F_{x1}}}{{M_1}} \) (velocity x2)
8. \( \frac{{dv_{y2}}}{{dt}} = \frac{{F_{y2}}}{{M_2}} + \frac{{F_{y1}}}{{M_1}} \) (velocity y2)

Where:
- \( x_1, y_1 \) are the positions of the first moonlet,
- \( v_{x1}, v_{y1} \) are its velocities,
- \( F_{x1}, F_{y1} \) are the gravitational forces acting on the first moonlet,
- \( M_1 \) is the mass of the first moonlet.
- Similar expressions hold for the second moonlet.

### Gravitational Forces Between Moonlets

In the equations, \( F_{x1}, F_{y1} \) and \( F_{x2}, F_{y2} \) represent the gravitational forces between moonlets. The forces are calculated as follows:

- \( F_{x1}, F_{y1} \) are the gravitational forces on moonlet 1 due to the Earth and moonlet 2.
- \( F_{x2}, F_{y2} \) are the gravitational forces on moonlet 2 due to the Earth and moonlet 1.

The positions used to calculate the distances between the moonlets and the Earth are adjusted for the relative positions of the moonlets.

### Simulation

The `odeint` function is then used to solve these differential equations numerically over a specified time span, and the resulting positions and velocities are recorded at discrete time intervals. The simulation advances in time steps, updating the positions and velocities based on the gravitational interactions between the Earth and moonlets and between the moonlets themselves.