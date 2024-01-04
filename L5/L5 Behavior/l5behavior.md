
1. **Gravitational Force Components:**
   The gravitational force components between two masses \(M_1\) and \(M_2\) at positions \((x, y)\) and \((x', y')\) are given by:

   \[ F_{x} = -\frac{G \cdot M_1 \cdot (x - x')}{r^3} - \frac{G \cdot M_2 \cdot (x - x')}{r^3} \]
   \[ F_{y} = -\frac{G \cdot M_1 \cdot (y - y')}{r^3} - \frac{G \cdot M_2 \cdot (y - y')}{r^3} \]

   Where \(r\) is the distance between the masses given by \(r = \sqrt{(x - x')^2 + (y - y')^2}\).

   In the equations_of_motion function, these forces are used to calculate the accelerations (\(dvxdt\) and \(dvydt\)) acting on the Moonlet.

2. **Equations of Motion:**
   The equations of motion for the Moonlet are given by the following set of ordinary differential equations (ODEs):

   \[ \frac{dx}{dt} = vx \]
   \[ \frac{dy}{dt} = vy \]
   \[ \frac{dvx}{dt} = \frac{F_{x}}{M_2} \]
   \[ \frac{dvy}{dt} = \frac{F_{y}}{M_2} \]

   These equations describe the position (\(x, y\)) and velocity (\(vx, vy\)) of the Moonlet over time. The odeint function is used to solve this system of ODEs numerically.

3. **Lagrange Point L5 Location:**
   The location of Lagrange point L5 in the Earth-Moon system is given by the coordinates \((x_{L5}, y_{L5})\), where:

   \[ x_{L5} = 0.5 \cdot R_{\text{earth-moon}} \cdot \cos(\theta) \]
   \[ y_{L5} = -\frac{\sqrt{3}}{2} \cdot R_{\text{earth-moon}} \cdot \sin(\theta) \]

   Here, \(\theta\) represents the angle that changes over time based on the Moon's orbital period. In the simulation, it's updated as:

   \[ \theta_{L5} += \frac{2 \pi \cdot \text{time\_step}}{27.3 \cdot 24 \cdot 3600} \]

4. **Simulation Loop:**
   The main simulation loop iterates through time steps, updating the Moon's angle (\(\theta_{\text{moon}}\)), the Lagrange point L5's angle (\(\theta_{L5}\)), and solving the equations of motion to determine the Moonlet's position and velocity. 

   The Moon's position is given by:

   \[ x_{\text{moon}} = R_{\text{earth-moon}} \cdot \cos(\theta_{\text{moon}}) \]
   \[ y_{\text{moon}} = R_{\text{earth-moon}} \cdot \sin(\theta_{\text{moon}}) \]

