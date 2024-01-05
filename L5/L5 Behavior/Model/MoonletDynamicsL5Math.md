1. **Gravitational Force Calculation:**
   - Gravitational force between Moonlet 1 and Earth/Moon:
     \[ F_{\text{{1x}}}, F_{\text{{1y}}} = -\frac{G \cdot M_{\text{{earth}}} \cdot (x_{\text{{1}}} - x_{\text{{2}}})}{r^3} - \frac{G \cdot M_{\text{{moon}}} \cdot (x_{\text{{1}}} - x_{\text{{2}}})}{r^3} \]
   - Gravitational force between Moonlet 2 and Earth/Moon:
     \[ F_{\text{{2x}}}, F_{\text{{2y}}} = -\frac{G \cdot M_{\text{{earth}}} \cdot (x_{\text{{2}}} - x_{\text{{1}}})}{r^3} - \frac{G \cdot M_{\text{{moon}}} \cdot (x_{\text{{2}}} - x_{\text{{1}}})}{r^3} \]
   - Where \( r = \sqrt{(x_{\text{{1}}} - x_{\text{{2}}})^2 + (y_{\text{{1}}} - y_{\text{{2}}})^2} \).

2. **Equations of Motion:**
   - Equations for Moonlet 1:
     \[ \text{{dx1dt}} = \text{{vx1}}, \quad \text{{dy1dt}} = \text{{vy1}}, \]
     \[ \text{{dvx1dt}} = \frac{F_{\text{{1x}}}}{M_{\text{{moonlet1}}}} + \frac{F_{\text{{2x}}}}{M_{\text{{moonlet2}}}}, \]
     \[ \text{{dvy1dt}} = \frac{F_{\text{{1y}}}}{M_{\text{{moonlet1}}}} + \frac{F_{\text{{2y}}}}{M_{\text{{moonlet2}}}} \]
   - Equations for Moonlet 2:
     \[ \text{{dx2dt}} = \text{{vx2}}, \quad \text{{dy2dt}} = \text{{vy2}}, \]
     \[ \text{{dvx2dt}} = \frac{F_{\text{{2x}}}}{M_{\text{{moonlet2}}}} + \frac{F_{\text{{1x}}}}{M_{\text{{moonlet1}}}}, \]
     \[ \text{{dvy2dt}} = \frac{F_{\text{{2y}}}}{M_{\text{{moonlet2}}}} + \frac{F_{\text{{1y}}}}{M_{\text{{moonlet1}}}} \]

3. **Lagrange Point L5 Location Calculation:**
   - Lagrange point L5 coordinates:
     \[ x_{\text{{L5}}} = 0.5 \cdot R_{\text{{earth-moon}}} \cdot \cos(\theta) \]
     \[ y_{\text{{L5}}} = \frac{\sqrt{3}}{2} \cdot R_{\text{{earth-moon}}} \cdot \sin(\theta) \]

4. **Simulation of Orbit:**
   - Initial state of the system:
     \[ \text{{initial\_state}} = [R_{\text{{earth-moon}}} + \text{{initial\_distance\_earth\_moon}}, 0, 0, \frac{2 \pi R_{\text{{earth-moon}}}}{27.3 \cdot 24 \cdot 3600}, \]
     \[ R_{\text{{earth-moon}}} + \text{{initial\_distance\_earth\_moon}} + 1e7, 0, 0, \frac{2 \pi R_{\text{{earth-moon}}}}{27.3 \cdot 24 \cdot 3600}] \]
   - Update of Moon's angle and Lagrange point L5's angle within the simulation loop.
