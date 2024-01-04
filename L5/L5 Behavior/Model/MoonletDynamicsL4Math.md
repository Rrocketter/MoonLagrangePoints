
### Gravitational Force Calculation:

The gravitational force acting on a celestial body at position ![img.png](img.png) due to another body at the origin is given by Newton's law of gravitation:

![img_1.png](img_1.png)

![img_2.png](img_2.png)

where:
- ![img_3.png](img_3.png) is the gravitational constant,
- ![img_4.png](img_4.png) is the mass of the celestial body (Earth or Moon),
- ![img_5.png](img_5.png) is the distance between the celestial bodies.

### Equations of Motion:

The motion of the celestial bodies is described by a system of differential equations, derived from Newton's second law:

![img_6.png](img_6.png)

![img_7.png](img_7.png)

![img_8.png](img_8.png)

![img_9.png](img_9.png)

where:
- ![img_10.png](img_10.png) are the coordinates of the body,
- ![img_11.png](img_11.png) are the components of the velocity,
- ![img_12.png](img_12.png) is the mass of the body,
- ![img_14.png](img_14.png) and ![img_13.png](img_13.png) are the components of the gravitational force.

### Lagrange Point Location Calculation:

The location of Lagrange point L5 is calculated using the following formulas:

![img_15.png](img_15.png)

![img_16.png](img_16.png)

Here, ![img_17.png](img_17.png) is the angle that changes with time, and it's updated based on the Moon's orbital period.

### Simulation:

The simulation integrates the equations of motion using the `odeint` function from the `scipy` library. It calculates the positions and velocities of the Moon, two moonlets, and Lagrange point L5 at each time step.