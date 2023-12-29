# Lagrange Point 5 (L5) Calculation


## Lagrange Point 5 Coordinates

The coordinates of Lagrange Point 5 (L5) in a Cartesian coordinate system are calculated using the following equations:

\[ x_{L5} = 0.5 \times R_{\text{Earth-Moon}} \]

\[ y_{L5} = -\frac{\sqrt{3}}{2} \times R_{\text{Earth-Moon}} \]

Here, 
- \( R_{\text{Earth-Moon}} \) is the distance between the Earth and the Moon.
- \( x_{L5} \) is the x-coordinate of L5.
- \( y_{L5} \) is the y-coordinate of L5.

## Orbital Parameters at Lagrange Point 5

Once the coordinates of L5 are determined, various orbital parameters at this point can be calculated. The radial distance from L5 to the combined center of mass of the Earth and Moon (\( r_{L5} \)) is computed using the distance formula:

\[ r_{L5} = \sqrt{x_{L5}^2 + y_{L5}^2} \]

Next, the angular velocity (\( \omega \)) is determined using the formula for centripetal acceleration:

\[ \omega = \sqrt{\frac{G \times (M_{\text{Moon}} + \text{moonlet\_mass})}{r_{L5}^3}} \]

Where:
- \( G \) is the gravitational constant.
- \( M_{\text{Moon}} \) is the mass of the Moon.
- \(\text{moonlet\_mass}\) is the mass of the object at Lagrange Point 5.

Other orbital parameters can be derived from the angular velocity:
- Orbital period (\( T \)) is given by \( T = \frac{2 \pi}{\omega} \).
- Orbital speed (\( v \)) is given by \( v = \omega \times r_{L5} \).

In summary, the provided Python code defines functions to calculate the coordinates of Lagrange Point 5 and various orbital parameters at that location based on the mass of the moonlet and the distance between the Earth and the Moon.