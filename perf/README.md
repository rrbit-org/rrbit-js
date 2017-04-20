latest performance results


```
filter-map-reduce 10k
-------------------------------------------------------
rbbit builder     :  5364.65 op/s ±   1.84% (85 samples)
rbbit list        :   601.10 op/s ±   1.24% (83 samples)
immutablejs       :   224.32 op/s ±   2.16% (79 samples)
mori              :    67.92 op/s ±   1.53% (68 samples)
seamless-immutable:   111.83 op/s ±   1.93% (71 samples)
native            :   179.39 op/s ±   1.15% (81 samples)
lodash native     :  2650.75 op/s ±   1.12% (87 samples)
-------------------------------------------------------


filter-map-reduce 1000
-------------------------------------------------------
rbbit builder     :  48258.68 op/s ±   4.96% (85 samples)
rbbit list        :   5896.40 op/s ±   1.08% (86 samples)
immutablejs       :   2336.60 op/s ±   1.86% (82 samples)
mori              :    651.25 op/s ±   1.51% (83 samples)
seamless-immutable:   1243.33 op/s ±   1.56% (85 samples)
native            :   1660.14 op/s ±   2.18% (81 samples)
lodash native     :  26086.43 op/s ±   1.52% (87 samples)
-------------------------------------------------------

filter-map-reduce 100
-------------------------------------------------------
rbbit builder     :  217528.49 op/s ±   1.08% (89 samples)
rbbit list        :   59218.30 op/s ±   0.96% (89 samples)
immutablejs       :   20197.12 op/s ±   1.78% (87 samples)
mori              :    6796.79 op/s ±   1.46% (85 samples)
seamless-immutable:    9211.70 op/s ±   1.23% (86 samples)
native            :   17274.93 op/s ±   1.68% (86 samples)
lodash native     :  260031.88 op/s ±   1.90% (87 samples)
-------------------------------------------------------

```


other performance measurements can be found on the [lib-rrbit page](https://github.com/rrbit-org/lib-rrbit)

