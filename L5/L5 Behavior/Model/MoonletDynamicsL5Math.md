1. **Gravitational Force Calculation:**
   - Gravitational force between Moonlet 1 and Earth/Moon:
     \[ F_{1x}, F_{1y} = -\frac{G \cdot M_{\text{earth}} \cdot (x_1 - x_2)}{r^3} - \frac{G \cdot M_{\text{moon}} \cdot (x_1 - x_2)}{r^3} \]
   - Gravitational force between Moonlet 2 and Earth/Moon:
     \[ F_{2x}, F_{2y} = -\frac{G \cdot M_{\text{earth}} \cdot (x_2 - x_1)}{r^3} - \frac{G \cdot M_{\text{moon}} \cdot (x_2 - x_1)}{r^3} \]
   - Where \( r = \sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2} \).

2. **Equations of Motion:**
   - Equations for Moonlet 1:
     \[ \frac{dx_{1}}{dt} = v_{x1}, \quad \frac{dy_{1}}{dt} = v_{y1} \]
     \[ \frac{dv_{x1}}{dt} = \frac{F_{1x}}{M_{\text{moonlet1}}} + \frac{F_{2x}}{M_{\text{moonlet2}}}, \]
     \[ \frac{dv_{y1}}{dt} = \frac{F_{1y}}{M_{\text{moonlet1}}} + \frac{F_{2y}}{M_{\text{moonlet2}}} \]
   - Equations for Moonlet 2:
     \[ \frac{dx_{2}}{dt} = v_{x2}, \quad \frac{dy_{2}}{dt} = v_{y2} \]
     \[ \frac{dv_{x2}}{dt} = \frac{F_{2x}}{M_{\text{moonlet2}}} + \frac{F_{1x}}{M_{\text{moonlet1}}}, \]
     \[ \frac{dv_{y2}}{dt} = \frac{F_{2y}}{M_{\text{moonlet2}}} + \frac{F_{1y}}{M_{\text{moonlet1}}} \]

3. **Lagrange Point L5 Location Calculation:**
   - Lagrange point L5 coordinates:
     \[ x_{L5} = 0.5 \cdot R_{\text{earth-moon}} \cdot \cos(\theta) \]
     \[ y_{L5} = \frac{\sqrt{3}}{2} \cdot R_{\text{earth-moon}} \cdot \sin(\theta) \]

4. **Simulation of Orbit:**
   - Initial state of the system:
     \[ \text{initial\_state} = [R_{\text{earth-moon}} + \text{initial\_distance\_earth\_moon}, 0, 0, \frac{2 \pi R_{\text{earth-moon}}}{27.3 \cdot 24 \cdot 3600}, \]
     \[ R_{\text{earth-moon}} + \text{initial\_distance\_earth\_moon} + 1e7, 0, 0, \frac{2 \pi R_{\text{earth-moon}}}{27.3 \cdot 24 \cdot 3600}] \]