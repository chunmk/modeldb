# -*- coding: utf-8 -*-

from ..external import six

from .._internal_utils import arg_handler

from . import _VertaDataType


class DiscreteHistogram(_VertaDataType):
    _TYPE_NAME = "discreteHistogram"
    _VERSION = "v1"

    @arg_handler.args_to_builtin(ignore_self=True)
    def __init__(self, buckets, data):
        if len(buckets) != len(data):
            raise ValueError("`buckets` and `data` must have the same length")
        if not all(isinstance(count, six.integer_types) for count in data):
            raise TypeError("`data` must contain all integers")

        self._buckets = buckets
        self._data = data

    def _as_dict(self):
        return self._as_dict_inner(
            {
                "buckets": self._buckets,
                "data": self._data,
            }
        )
