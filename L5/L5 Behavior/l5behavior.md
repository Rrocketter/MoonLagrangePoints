
1. **Gravitational Force Calculation :**
   - Gravitational force in the x-direction:
     \[ F_{x} = -\frac{G \cdot M_1 \cdot x}{r^3} - \frac{G \cdot M_2 \cdot x}{r^3} \]
   - Gravitational force in the y-direction:
     \[ F_{y} = -\frac{G \cdot M_1 \cdot y}{r^3} - \frac{G \cdot M_2 \cdot y}{r^3} \]
   - Where \( r = \sqrt{x^2 + y^2} \).

2. **Equations of Motion :**
   - Newton's second law in the x-direction:
     \[ \frac{dx}{dt} = vx \]
   - Newton's second law in the y-direction:
     \[ \frac{dy}{dt} = vy \]
   - Acceleration in the x-direction:
     \[ \frac{dvx}{dt} = \frac{F_x}{M_{\text{{moonlet}}}} \]
   - Acceleration in the y-direction:
     \[ \frac{dvy}{dt} = \frac{F_y}{M_{\text{{moonlet}}}} \]

3. **Lagrange Point L5 Location Calculation :**
   - Lagrange point L5 coordinates:
     \[ x_{\text{{L5}}} = 0.5 \cdot R_{\text{{earth-moon}}} \cdot \cos(\theta) \]
     \[ y_{\text{{L5}}} = -\frac{\sqrt{3}}{2} \cdot R_{\text{{earth-moon}}} \cdot \sin(\theta) \]

4. **Simulation of Orbit:**
   - Initial state of the moonlet:
   
     \[ \text{{initial\_state}} = [R_{\text{{earth-moon}}} + \text{{initial\_distance\_earth\_moon}}, 0, 0, \frac{2 \cdot \pi \cdot R_{\text{{earth-moon}}}}{27.3 \cdot 24 \cdot 3600}] \]
   - Update of Moon's angle:
   
     \[ \theta_{\text{{moon}}} = \frac{2 \cdot \pi \cdot t}{27.3 \cdot 24 \cdot 3600} \]
   - Update of Lagrange point L5's angle:
     \[ \theta_{\text{{L5}}} \text{{ (within the loop) }} = \theta_{\text{{L5}}} + \frac{2 \cdot \pi \cdot \text{{time\_step}}}{27.3 \cdot 24 \cdot 3600} \]
