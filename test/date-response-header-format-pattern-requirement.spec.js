/**
 * Copyright 2022 Cisco Systems, Inc. and its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import fsPromises from 'fs/promises';
import path from 'path';
import { prepLinter } from '../util/testUtils';
import ruleset from '../api-insights-openapi-ruleset';
const ruleName = 'date-response-header-format-pattern-requirement';
const resPath = path.join(__dirname, `resources/${ ruleName }`);

describe(ruleName, () => {
  let spectral;

  beforeAll(() => {
    spectral = prepLinter(ruleset, ruleName);
  });
  test('should require the Date header to use pattern instead of format', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/negative.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([
      {
        code: ruleName,
        message: 'All \'Date\' response headers should use a custom pattern match for RFC 5322. date-time or other given formats should not be used (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'headers',
          'Date',
          'schema',
        ],
        range: {
          start: {
            line: 24,
            character: 21,
          },
          end: {
            line: 26,
            character: 33,
          },
        },
        severity: 1,
      },
      {
        code: ruleName,
        message: 'All \'Date\' response headers should use a custom pattern match for RFC 5322. date-time or other given formats should not be used (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/test',
          'get',
          'responses',
          '200',
          'headers',
          'Date',
          'schema',
          'format',
        ],
        range: {
          start: {
            line: 26,
            character: 24,
          },
          end: {
            line: 26,
            character: 33,
          },
        },
        severity: 1,
      },
      {
        code: ruleName,
        message: 'All \'Date\' response headers should use a custom pattern match for RFC 5322. date-time or other given formats should not be used (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
        path: [
          'paths',
          '/anotherTest',
          'get',
          'responses',
          '200',
          'headers',
          'Date',
          'schema',
        ],
        range: {
          start: {
            line: 38,
            character: 21,
          },
          end: {
            line: 39,
            character: 29,
          },
        },
        severity: 1,
      },
    ]);
  });
  test('should pass responses with a Date header and a pattern defined', async () => {
    const spec = await fsPromises.readFile(`${ resPath }/positive.yml`);
    const res = await spectral.run(spec.toString());

    expect(res).toEqual([]);
  });
});
