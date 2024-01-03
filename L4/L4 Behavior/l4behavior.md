1. **Gravitational Force Components:**
   - The function `gravitational_force` calculates the x and y components of the gravitational force acting on a celestial body at coordinates (x, y), influenced by two massive bodies (M1 and M2).

   \[ F_x = -\frac{G \cdot M_1 \cdot x}{r^3} - \frac{G \cdot M_2 \cdot x}{r^3} \]
   \[ F_y = -\frac{G \cdot M_1 \cdot y}{r^3} - \frac{G \cdot M_2 \cdot y}{r^3} \]

   Where:
   - \( F_x \) and \( F_y \) are the x and y components of the gravitational force,
   - \( G \) is the gravitational constant,
   - \( M_1 \) and \( M_2 \) are the masses of the two celestial bodies,
   - \( x \) and \( y \) are the coordinates of the celestial body,
   - \( r \) is the distance between the celestial body and the two massive bodies.

2. **Differential Equations (equations_of_motion):**
   - The function `equations_of_motion` defines the system of differential equations representing the motion of a celestial body influenced by gravitational forces.

   \[ \frac{dx}{dt} = vx \]
   \[ \frac{dy}{dt} = vy \]
   \[ \frac{dvx}{dt} = \frac{F_x}{M} \]
   \[ \frac{dvy}{dt} = \frac{F_y}{M} \]

   Where:
   - \( x \) and \( y \) are the coordinates of the celestial body,
   - \( vx \) and \( vy \) are the velocities in the x and y directions,
   - \( F_x \) and \( F_y \) are the x and y components of the gravitational force calculated using `gravitational_force`,
   - \( M \) is the mass of the celestial body.

3. **Lagrange Point L4 Location:**
   - The function `lagrange_point_l4_location` calculates the x and y coordinates of Lagrange point L4 based on the angle \(\theta\).

   \[ x_{L4} = 0.5 \times R_{\text{earth-moon}} \times \cos(\theta) \]
   \[ y_{L4} = \frac{\sqrt{3}}{2} \times R_{\text{earth-moon}} \times \sin(\theta) \]

   Where:
   - \( R_{\text{earth-moon}} \) is the distance between Earth and Moon,
   - \( \theta \) is the angle determining the position of Lagrange point L4.

4. **Simulation of Moonlet's Motion:**
   - The function `simulate_orbit` integrates the equations of motion using the `odeint` solver, simulating the motion of the moonlet.

   - It updates the position of the moonlet at each time step, taking into account the gravitational influence from Earth and the changing position of the Moon.

   - The Moon's position is calculated based on its orbital period, and Lagrange point L4's position is updated based on the Moon's orbital period.

   - The resulting positions of the Moon, Moonlet, and Lagrange point L4 are stored in `moonlet_timeseries` for each time step.
