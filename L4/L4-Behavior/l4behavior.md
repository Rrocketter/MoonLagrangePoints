1. **Gravitational Force Components:**
   - The function `gravitational_force` calculates the x and y components of the gravitational force acting on a celestial body at coordinates (x, y), influenced by two massive bodies (M1 and M2).

  ![img.png](../../equationImages/L4%20behavior/img.png)

   ![img_1.png](../../equationImages/L4%20behavior/img_1.png)

   Where:
   - ![img_2.png](../../equationImages/L4%20behavior/img_2.png) and ![img_3.png](../../equationImages/L4%20behavior/img_3.png) are the x and y components of the gravitational force,
   - ![img_4.png](../../equationImages/L4%20behavior/img_4.png) is the gravitational constant,
   - ![img_5.png](../../equationImages/L4%20behavior/img_5.png) and ![img_6.png](../../equationImages/L4%20behavior/img_6.png) are the masses of the two celestial bodies,
   - ![img_7.png](../../equationImages/L4%20behavior/img_7.png) and ![img_8.png](../../equationImages/L4%20behavior/img_8.png) are the coordinates of the celestial body,
   - ![img_9.png](../../equationImages/L4%20behavior/img_9.png) is the distance between the celestial body and the two massive bodies.

2. **Differential Equations (equations_of_motion):**
   - The function `equations_of_motion` defines the system of differential equations representing the motion of a celestial body influenced by gravitational forces.

   ![img_10.png](../../equationImages/L4%20behavior/img_10.png)

   ![img_11.png](../../equationImages/L4%20behavior/img_11.png)

   ![img_12.png](../../equationImages/L4%20behavior/img_12.png)

   ![img_13.png](../../equationImages/L4%20behavior/img_13.png)

   Where:
   - ![img_7.png](../../equationImages/L4%20behavior/img_7.png) and ![img_8.png](../../equationImages/L4%20behavior/img_8.png) are the coordinates of the celestial body,
   - ![img_14.png](../../equationImages/L4%20behavior/img_14.png) and ![img_15.png](../../equationImages/L4%20behavior/img_15.png) are the velocities in the x and y directions,
   - ![img_2.png](../../equationImages/L4%20behavior/img_2.png) and ![img_3.png](../../equationImages/L4%20behavior/img_3.png) are the x and y components of the gravitational force calculated using `gravitational_force`,
   - ![img_16.png](../../equationImages/L4%20behavior/img_16.png) is the mass of the celestial body.

3. **Lagrange Point L4 Location:**
   - The function `lagrange_point_l4_location` calculates the x and y coordinates of Lagrange point L4 based on the angle \(\theta\).


   ![img_17.png](../../equationImages/L4%20behavior/img_17.png)

   ![img_18.png](../../equationImages/L4%20behavior/img_18.png)

   Where:
   - ![img_19.png](../../equationImages/L4%20behavior/img_19.png) is the distance between Earth and Moon,
   - ![img_20.png](../../equationImages/L4%20behavior/img_20.png) is the angle determining the position of Lagrange point L4.

4. **Simulation of Moonlet's Motion:**
   - The function `simulate_orbit` integrates the equations of motion using the `odeint` solver, simulating the motion of the moonlet.

   - It updates the position of the moonlet at each time step, taking into account the gravitational influence from Earth and the changing position of the Moon.

   - The Moon's position is calculated based on its orbital period, and Lagrange point L4's position is updated based on the Moon's orbital period.

   - The resulting positions of the Moon, Moonlet, and Lagrange point L4 are stored in `moonlet_timeseries` for each time step.
