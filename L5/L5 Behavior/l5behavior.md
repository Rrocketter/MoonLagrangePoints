
1. **Gravitational Force Components:**
   The gravitational force components between two masses \(M_1\) and \(M_2\) at positions \((x, y)\) and \((x', y')\) are given by:

   ![img.png](../../equationImages/L5%20Behavior/img.png)
   
   ![img_1.png](../../equationImages/L5%20Behavior/img_1.png)

   Where ![img_2.png](../../equationImages/L5%20Behavior/img_2.png) is the distance between the masses given by ![img_3.png](../../equationImages/L5%20Behavior/img_3.png).

   These forces are used to calculate the accelerations ![img_4.png](../../equationImages/L5%20Behavior/img_4.png) and ![img_5.png](../../equationImages/L5%20Behavior/img_5.png) acting on the Moonlet.


2. **Equations of Motion:**
   The equations of motion for the Moonlet are given by the following set of ordinary differential equations (ODEs):

   ![img_6.png](../../equationImages/L5%20Behavior/img_6.png)

   ![img_7.png](../../equationImages/L5%20Behavior/img_7.png)

   ![img_8.png](../../equationImages/L5%20Behavior/img_8.png)

   ![img_9.png](../../equationImages/L5%20Behavior/img_9.png)


These equations describe the position ![img_10.png](../../equationImages/L5%20Behavior/img_10.png) and velocity ![img_11.png](../../equationImages/L5%20Behavior/img_11.png) of the Moonlet over time. The odeint function is used to solve this system of ODEs numerically.


3. **Lagrange Point L5 Location:**
   The location of Lagrange point L5 in the Earth-Moon system is given by the coordinates![img_12.png](../../equationImages/L5%20Behavior/img_12.png), where:

   
   ![img_13.png](../../equationImages/L5%20Behavior/img_13.png)

   ![img_15.png](../../equationImages/L5%20Behavior/img_15.png)

   Here, ![img_16.png](../../equationImages/L5%20Behavior/img_16.png) represents the angle that changes over time based on the Moon's orbital period. In the simulation, it's updated as:

   ![img_18.png](../../equationImages/L5%20Behavior/img_18.png)

4. **Simulation Loop:**
   The main simulation loop iterates through time steps, updating the Moon's angle ![img_21.png](../../equationImages/L5%20Behavior/img_21.png), the Lagrange point L5's angle ![img_22.png](../../equationImages/L5%20Behavior/img_22.png) and solving the equations of motion to determine the Moonlet's position and velocity. 

   The Moon's position is given by:

![img_19.png](../../equationImages/L5%20Behavior/img_19.png)

![img_20.png](../../equationImages/L5%20Behavior/img_20.png)
