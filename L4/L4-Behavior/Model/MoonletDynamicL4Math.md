### Gravitational Force Calculation

The force between two masses due to gravity is given by Newton's law of gravitation:

![img.png](../../../equationImages/L4Model/img.png)

Where:
- ![img_1.png](../../../equationImages/L4Model/img_1.png) is the gravitational force,
- ![img_2.png](../../../equationImages/L4Model/img_2.png) is the gravitational constant,
- ![img_3.png](../../../equationImages/L4Model/img_3.png) and ![img_4.png](../../../equationImages/L4Model/img_4.png) are the masses of the two objects,
- ![img_5.png](../../../equationImages/L4Model/img_5.png) is the distance between the centers of the masses.

### Equations of Motion

The differential equations that describe the motion of each moonlet are derived from Newton's second law:

![img_6.png](../../../equationImages/L4Model/img_6.png)

For each moonlet, we have four differential equations:

1. ![img_7.png](../../../equationImages/L4Model/img_7.png)
2. ![img_8.png](../../../equationImages/L4Model/img_8.png) (position y1)
3. ![img_9.png](../../../equationImages/L4Model/img_9.png) (velocity x1)
4. ![img_10.png](../../../equationImages/L4Model/img_10.png) (velocity y1)

5. ![img_11.png](../../../equationImages/L4Model/img_11.png) (position x2)
6. ![img_12.png](../../../equationImages/L4Model/img_12.png) (position y2)
7. ![img_13.png](../../../equationImages/L4Model/img_13.png) (velocity x2)
8. ![img_14.png](../../../equationImages/L4Model/img_14.png) (velocity y2)

Where:
- ![img_15.png](../../../equationImages/L4Model/img_15.png) are the positions of the first moonlet,
- ![img_16.png](../../../equationImages/L4Model/img_16.png) are its velocities,
- ![img_17.png](../../../equationImages/L4Model/img_17.png) are the gravitational forces acting on the first moonlet,
- ![img_18.png](../../../equationImages/L4Model/img_18.png) is the mass of the first moonlet.
- Similar expressions hold for the second moonlet.

### Gravitational Forces Between Moonlets

In the equations, ![img_19.png](../../../equationImages/L4Model/img_19.png) represent the gravitational forces between moonlets. The forces are calculated as follows:

- ![img_20.png](../../../equationImages/L4Model/img_20.png) are the gravitational forces on moonlet 1 due to the Earth and moonlet 2.
- ![img_21.png](../../../equationImages/L4Model/img_21.png) are the gravitational forces on moonlet 2 due to the Earth and moonlet 1.

The positions used to calculate the distances between the moonlets and the Earth are adjusted for the relative positions of the moonlets.

### Simulation

The `odeint` function is then used to solve these differential equations numerically over a specified time span, and the resulting positions and velocities are recorded at discrete time intervals. The simulation advances in time steps, updating the positions and velocities based on the gravitational interactions between the Earth and moonlets and between the moonlets themselves.