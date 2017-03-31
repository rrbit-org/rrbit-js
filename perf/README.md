latest performance results


filter-map-reduce 10
|------------------|-------------------|------------------|
|rbbit builder     |  283551.59 op/s ± |  2.12% (81 samples)|
|rbbit list        |  477598.22 op/s ± |  1.22% (90 samples)|
|immutablejs       |   84907.81 op/s ± |  2.91% (79 samples)|
|mori              |   50281.80 op/s ± |  0.99% (86 samples)|
|seamless-immutable|   23005.81 op/s ± |  1.26% (83 samples)|
|native            |  155026.01 op/s ± |  1.62% (85 samples)|
|------------------|-------------------|------------------|

filter-map-reduce 100
|------------------|-------------------|------------------|
|rbbit builder     |  198077.45 op/s ± |  2.48% (84 samples)|
|rbbit list        |   58284.15 op/s ± |  1.29% (88 samples)|
|immutablejs       |   18807.20 op/s ± |  1.76% (86 samples)|
|mori              |    6354.57 op/s ± |  1.37% (85 samples)|
|seamless-immutable|    9029.74 op/s ± |  0.86% (87 samples)|
|native            |   16852.83 op/s ± |  1.30% (87 samples)|
|------------------|-------------------|------------------|

filter-map-reduce 1k
|------------------|------------------|-------------------|
|rbbit builder     |  33765.26 op/s ± |  1.09% (84 samples)|
|rbbit list        |   5691.01 op/s ± |  0.60% (91 samples)|
|immutablejs       |   2346.93 op/s ± |  1.77% (88 samples)|
|mori              |    656.63 op/s ± |  1.07% (88 samples)|
|seamless-immutable|   1262.28 op/s ± |  1.02% (90 samples)|
|native            |   1750.41 op/s ± |  1.16% (89 samples)|
|------------------|------------------|-------------------|

filter-map-reduce 10k
|------------------|-----------------|--------------------|
|rbbit builder     |  3776.34 op/s ± |  0.86% (90 samples)|
|rbbit list        |   540.65 op/s ± |  0.85% (88 samples)|
|immutablejs       |   226.07 op/s ± |  1.92% (80 samples)|
|mori              |    71.39 op/s ± |  0.95% (72 samples)|
|seamless-immutable|   108.82 op/s ± |  2.13% (68 samples)|
|native            |   171.69 op/s ± |  1.76% (77 samples)|
|------------------|-----------------|--------------------|

filter-map-reduce 100k
|------------------|-----------------|--------------------|
|rbbit builder     |  286.18 op/s ± |  1.95% (82 samples)|
|rbbit list        |   54.40 op/s ± |  1.35% (69 samples)|
|immutablejs       |   20.45 op/s ± |  2.05% (38 samples)|
|mori              |    5.47 op/s ± |  3.48% (18 samples)|
|seamless-immutable|    7.78 op/s ± |  3.35% (24 samples)|
|native            |   13.18 op/s ± |  2.06% (37 samples)|
|------------------|-----------------|--------------------|

filter-map-reduce 1000k
|------------------|----------------|---------------------|
|rbbit builder     |  29.01 op/s ± |  1.54% (51 samples)|
|rbbit list        |   4.69 op/s ± |  3.71% (16 samples)|
|immutablejs       |   1.92 op/s ± |  3.33% (9 samples)|
|mori              |   0.55 op/s ± |  2.24% (6 samples)|
|seamless-immutable|   0.68 op/s ± |  3.64% (6 samples)|
|native            |   1.22 op/s ± |  2.68% (8 samples)|
-------------------|----------------|--------------------|
