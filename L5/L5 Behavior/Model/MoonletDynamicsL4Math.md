
### Gravitational Force Calculation:

The gravitational force acting on a celestial body at position \((x, y)\) due to another body at the origin is given by Newton's law of gravitation:

\[ F_x = -\frac{G \cdot M_1 \cdot x}{r^3} \]
\[ F_y = -\frac{G \cdot M_1 \cdot y}{r^3} \]

where:
- \( G \) is the gravitational constant,
- \( M_1 \) is the mass of the celestial body (e.g., Earth or Moon),
- \( r = \sqrt{x^2 + y^2} \) is the distance between the celestial bodies.

### Equations of Motion:

The motion of the celestial bodies is described by a system of differential equations, derived from Newton's second law:

\[ \frac{dx}{dt} = vx \]
\[ \frac{dy}{dt} = vy \]
\[ \frac{dvx}{dt} = \frac{F_x}{M} \]
\[ \frac{dvy}{dt} = \frac{F_y}{M} \]

where:
- \( (x, y) \) are the coordinates of the body,
- \( (vx, vy) \) are the components of the velocity,
- \( M \) is the mass of the body,
- \( F_x \) and \( F_y \) are the components of the gravitational force.

### Lagrange Point Location Calculation:

The location of Lagrange point L5 is calculated using the following formulas:

\[ x_{L5} = 0.5 \cdot R_{\text{earth-moon}} \cdot \cos(\theta) \]
\[ y_{L5} = \frac{\sqrt{3}}{2} \cdot R_{\text{earth-moon}} \cdot \sin(\theta) \]

Here, \( \theta \) is the angle that changes with time, and it's updated based on the Moon's orbital period.

### Simulation:

The simulation integrates the equations of motion using the `odeint` function from the `scipy` library. It calculates the positions and velocities of the Moon, two moonlets, and Lagrange point L5 at each time step.